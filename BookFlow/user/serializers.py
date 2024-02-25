from .models import User
from rest_framework import serializers
from django.db import IntegrityError
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.hashers import make_password


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
            data['email'] = ["Este campo é obrigatório."]
            
        if not user.get('first_name'):
            data["ok"] = False
            data['first_name'] = ["Este campo é obrigatório."]
            
        if not user.get('last_name'):
            data["ok"] = False
            data['last_name'] = ["Este campo é obrigatório."]
            
        if not user.get('username'):
            if not user.get('google_id'):
                data["ok"] = False
                data['username'] = ["Este campo é obrigatório, ou deve ser preenchido pelo google_id."]
        
        return data

    def create(self, validated_data):
        try:
            email = validated_data.get('email')
            user = None
            if email:
                user = User.objects.filter(email=validated_data.get('email')).first()

            if user:
                return user
            else:
                validated = self.validate_user(validated_data)
                
                if validated["ok"]:
                    user = User.objects.create_user(
                        username=validated_data.get('google_id') if validated_data.get('google_id') is not None else validated_data.get('username'),
                        email=validated_data.get('email'),
                        first_name=validated_data.get('first_name'),
                        last_name=validated_data.get('last_name'),
                        photo_url=validated_data.get('photo_url'),
                        account_type=validated_data.get('account_type') if validated_data.get('account_type') is not None else "common_user",
                        is_active=True,
                        notification_token=validated_data.get('notification_token') if validated_data.get('notification_token') is not None else None
                    )
                    return user
                else:
                    raise serializers.ValidationError(validated)

        except IntegrityError as e:
            raise serializers.ValidationError({'error': _('Erro de integridade ao criar usuário.')})