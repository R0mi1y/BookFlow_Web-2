from .models import User
from rest_framework import serializers
from django.db import IntegrityError
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.hashers import make_password


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = '__all__'
        
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = super().create(validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user


        
class GoogleAccountSerializer(serializers.ModelSerializer):
    google_id = serializers.CharField(source='id', max_length=255)
    email = serializers.EmailField(required=True)
    given_name = serializers.CharField(source='first_name', max_length=150)
    family_name = serializers.CharField(source='last_name', max_length=150)
    picture = serializers.URLField(source='photo_url')

    class Meta:
        model = User
        fields = ('google_id', 'username', 'email', 'given_name', 'family_name', 'picture', 'phone', 'account_type', 'is_active', 'biography', 'street', 'city', 'state', 'postal_code')
        extra_kwargs = {
            'username': {'required': True},
            'phone': {'required': False},
            'account_type': {'required': True},
            'is_active': {'required': False},
            'biography': {'required': False},
            'street': {'required': False},
            'city': {'required': False},
            'state': {'required': False},
            'postal_code': {'required': False},
        }

    def create(self, validated_data):
        try:
            # Usando o email para verificar se o usuário já existe
            user = User.objects.filter(email=validated_data.get('email')).first()

            if user:
                return user
            else:
                user = User.objects.create_user(
                    username=validated_data.get('google_id'),
                    email=validated_data.get('email'),
                    first_name=validated_data.get('first_name'),
                    last_name=validated_data.get('last_name'),
                    # Supondo que você tenha os campos 'photo_url' e 'account_type' em seu modelo de usuário
                    photo_url=validated_data.get('photo_url'),
                    account_type=validated_data.get('account_type'),
                    is_active=validated_data.get('is_active', True),
                    # Adicione os outros campos conforme necessário
                )
                return user

        except IntegrityError as e:
            raise serializers.ValidationError({'error': _('Erro de integridade ao criar usuário.')})