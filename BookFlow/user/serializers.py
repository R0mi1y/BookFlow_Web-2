from .models import User
from rest_framework import serializers
from django.db import IntegrityError
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.hashers import make_password, check_password
import random
import string


def log(msm): 
    from django.conf import settings
    import os
    import json
    
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

def generate_random_string(length=10):
    # Caracteres possíveis para a string
    characters = string.ascii_letters + string.digits

    # Gerar a string aleatória
    random_string = ''.join(random.choice(characters) for _ in range(length))

    return random_string

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = '__all__'
        extra_kwargs = {'password': {'write_only': True, 'required': False}, 'username': {'required': False}}


    def validate_user(self, user):
        data = {
            "ok": True
        }
        
        if not user.get('email'):
            data["ok"] = False
            data['email'] = ["O email é obrigatório."]
            
        if not user.get('first_name'):
            data["ok"] = False
            data['first_name'] = ["O primeiro nome é obrigatório."]
            
        if not user.get('last_name'):
            data["ok"] = False
            data['last_name'] = ["O ultimo nome é obrigatório."]
            
        if not user.get('google_id') and not user.get('password'):
            data["ok"] = False
            data['password'] = ["A senha é obrigatório."]
            
        if not user.get('username'):
            if not user.get('google_id'):
                data["ok"] = False
                data['username'] = ["O nome de usuário é obrigatório, ou deve ser preenchido pelo google_id."]
        
        return data

    def create(self, validated_data):
        log("Criando")
        try:
            email = validated_data.get('email')
            user = None
            if email:
                user = User.objects.filter(email=validated_data.get('email')).first()

            if user:
                return user
            else:
                validated = self.validate_user(validated_data)
                log("Criado")
                if validated["ok"]:
                    log(validated_data)
                    log(make_password(validated_data.get('password') if validated_data.get('password') is not None else generate_random_string()))
                    user = User.objects.create_user(
                        username=validated_data.get('google_id') if validated_data.get('google_id') is not None else validated_data.get('username'),
                        email=validated_data.get('email'),
                        first_name=validated_data.get('first_name'),
                        last_name=validated_data.get('last_name'),
                        photo_url=validated_data.get('photo_url'),
                        account_type=validated_data.get('account_type') if validated_data.get('account_type') is not None else "common_user",
                        password=validated_data.get('password') if validated_data.get('password') is not None else generate_random_string(),
                        is_active=True,
                        notification_token=validated_data.get('notification_token') if validated_data.get('notification_token') is not None else None
                    )
                    log(check_password("123123123", user.password))
                    
                    return user
                else:
                    raise serializers.ValidationError(validated)

        except IntegrityError as e:
            raise serializers.ValidationError({'error': _('Erro de integridade ao criar usuário.')})