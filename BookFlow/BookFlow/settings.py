from datetime import timedelta
import os
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-x9=@u)9g4x46$3&lvp$w4_0=$njt25=l8g)g-s5(6lewtremkj'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ["*"]


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Meus apps
    
    'book',
    'user',
    'settings',
    
    # Apps de terceiros
    'rest_framework',
    'rest_framework_simplejwt',
    'drf_yasg',
    
    "allauth",
    "allauth.account",
    "allauth.socialaccount",
    "allauth.socialaccount.providers.google",
]

MIDDLEWARE = [
    'allauth.account.middleware.AccountMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'BookFlow.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / "templates"],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'BookFlow.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": "bookflow",
        "USER": "root",
        "OPTIONS": {
            "sql_mode": "traditional",
        },
        "PASSWORD": "",
        "HOST": "localhost",
        "PORT": "3306",
    }
}


# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

AUTH_USER_MODEL = 'user.User'

# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'pt-BR'

TIME_ZONE = 'America/Sao_Paulo'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

STATICFILES_DIRS = [os.path.join(BASE_DIR, "static")]

LOGIN_REDIRECT_URL = "/"
LOGOUT_REDIRECT_URL = "/clientes/home"


ROLEPERMISSIONS_MODULE = "PratoCerto.roles"

# Configurações de emails

EMAIL_HOST = "smtp.gmail.com"
EMAIL_HOST_USER = "edielromily01@gmail.com"
EMAIL_HOST_PASSWORD = "pvgybzhcgmltvbhh"
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"

MEDIA_URL = "/media/"
MEDIA_ROOT = os.path.join(BASE_DIR, "media")


CORS_ORIGIN_ALLOW_ALL = True

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),  # Define o tempo de vida do token de acesso
    'SLIDING_TOKEN_REFRESH_LIFETIME': timedelta(days=1),  # Define o tempo de vida do token de atualização
    'SLIDING_TOKEN_LIFETIME': timedelta(days=30),  # Define o tempo de vida do token deslizante
    'SLIDING_TOKEN_REFRESH_LIFETIME_GRACE_PERIOD': timedelta(days=2),  # Define o período de graça para atualizar um token deslizante
    'SLIDING_TOKEN_REFRESH_AFTER_GRACE_PERIOD': False,  # Define se um token deslizante pode ser atualizado após o período de graça
    'SLIDING_TOKEN_REFRESH_ON_LOGIN': True,  # Define se um token deslizante deve ser atualizado no login
    'SLIDING_TOKEN_REFRESH_ON_REFRESH': True,  # Define se um token deslizante deve ser atualizado quando é feito um pedido para atualizar o token de acesso
    'ALGORITHM': 'HS256',  # Define o algoritmo de criptografia usado para gerar os tokens
    # 'SIGNING_KEY': None,  # Deve ser definido para um valor secreto para segurança
    # 'VERIFYING_KEY': None,  # Deve ser definido para um valor secreto para segurança
    'AUTH_HEADER_TYPES': ('Bearer',),  # Define o tipo de cabeçalho de autenticação esperado
}