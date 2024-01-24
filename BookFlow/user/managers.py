import json
import re
from django.contrib.auth.models import UserManager
from django.db import IntegrityError
from django.forms import ValidationError
from django.utils.translation import gettext as _
from django.utils.crypto import get_random_string

class UserManager(UserManager):
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
        
        if type(data) == str:
            data = json.loads(data)
        
        if 'email' in data:
            user = User.objects.filter(email=data['email']).first()
        else:
            return None, None
        
        if user:
            return user, False 
        else:
            if 'name' in data:
                if User.objects.filter(username=data['name']).first():
                    data['name'] += get_random_string(4)
                try:
                    new_user = User.objects.create(
                        google_id=data['id'],
                        email=data['email'].lower(),
                        username=data['name'],
                        first_name=data['given_name'],
                        last_name=data['family_name'],
                        photo_url=data['picture'],
                    )
                    
                    print("Creating new user")
                    
                    return new_user, True  # Retorna o novo usuário e um sinalizador indicando que foi criado
                except IntegrityError as e:
                    error_message = e.args[1]
                    if "Duplicate entry" in error_message:
                        camp = re.search(r"for key '(\w+)'", error_message)
                        
                        return None, f"Um usuário com esse {camp.group(1)} já existe!"

                except ValidationError as e:
                    return None, str(e.args)

                except Exception as e:
                    # Captura outras exceções genéricas
                    return None, f"Error: {str(e)}"
            else:
                return None, None