import json
import re
from django.contrib.auth.models import UserManager
from django.db import IntegrityError
from django.forms import ValidationError
from django.utils.translation import gettext as _
from django.utils.crypto import get_random_string
import json
import os
from django.conf import settings
import requests
from notification.models import Notification


def log(msm): 
    log_path_json = os.path.join(settings.MEDIA_ROOT, 'log.json')

    # Lê o conteúdo atual do arquivo de log JSON
    if os.path.exists(log_path_json):
        with open(log_path_json, 'r') as log_file:
            try:
                log_data = json.load(log_file)
            except json.JSONDecodeError:
                log_data = {'logs': []}
    else:
        log_data = {'logs': []}

    # Adiciona o novo erro à lista
    log_data['logs'].append(str(msm))

    # Escreve a lista atualizada de volta ao arquivo JSON
    with open(log_path_json, 'w') as log_file:
        json.dump(log_data, log_file, indent=2)

class UserManager(UserManager):
    def send_notification(self, user, title, message, from_field=None, description=None):
        Notification.objects.create(user=user, title=title, message=message, from_field=from_field if from_field is not None else '', description=description if description is not None else '', visualized=False)
        
        url = "https://exp.host/--/api/v2/push/send"
        headers = {"Content-Type": "application/json"}

        data = {
            "to": user.notification_token,
            "title": title,
            "body": message
        }

        response = requests.post(url, headers=headers, json=data)
        log(response)
        
    
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('O campo de e-mail deve ser preenchido')
        
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, password, **extra_fields)
    
    def create_by_google(self, data):
        from .models import User
        
        if isinstance(data, str):
            data = json.loads(data)

        email = data.get('email')
        if not email:
            return None, None

        user = User.objects.filter(email=email).first()

        if user:
            if "id" in data and User.objects.filter(google_id=data["id"]).exists():
                return user, False
            else:
                return None, None
                
        name = data.get('name', '')
        name += get_random_string(4) if name and User.objects.filter(username=name).exists() else ''

        try:
            new_user = User.objects.create(
                google_id=data['id'],
                email=email.lower(),
                username=name,
                first_name=data.get('given_name', ''),
                last_name=data.get('family_name', ''),
                photo_url=data.get('picture', ''),
            )

            print("Creating new user")
            return new_user, True

        except IntegrityError as e:
            if "Duplicate entry" in str(e):
                match = re.search(r"for key '(\w+)'", str(e))
                return None, f"Um usuário com esse {match.group(1)} já existe!"

        except ValidationError as e:
            return None, str(e.args)

        except Exception as e:
            return None, f"Error: {str(e)}"