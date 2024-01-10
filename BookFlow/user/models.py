import json
from django.contrib.auth.models import AbstractUser, UserManager
from django.db import IntegrityError, models
from django.forms import ValidationError
from book.models import Book
from django.utils.translation import gettext as _
import re
from django.utils.crypto import get_random_string
from django.contrib.auth.hashers import make_password


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
    

class User(AbstractUser):
    google_id = models.CharField(null=True, blank=True, max_length=255)
    photo = models.ImageField(upload_to='profile_photos/', null=True, blank=True)
    photo_url = models.URLField(max_length=255, blank=True, null=True)
    phone = models.CharField(max_length=15, null=True, blank=True)
    account_type = models.CharField(max_length=255, default="common_user")
    active = models.BooleanField(default=True)
    email = models.EmailField(_("email address"), blank=True, unique=True)
    biography = models.TextField(null=True, blank=True)
    street = models.CharField(max_length=255, null=True, blank=True)
    house_number = models.CharField(max_length=255, null=True, blank=True)
    city = models.CharField(max_length=255, null=True, blank=True)
    state = models.CharField(max_length=255, null=True, blank=True)
    postal_code = models.CharField(max_length=20, null=True, blank=True)
    wishlist = models.ManyToManyField(Book, related_name='user_wishlist', blank=True)
    
    objects = UserManager()
    
    def clean_password(self):
        super().clean()
        
        
    
    def save(self, *args, **kwargs):
        # Se o google_id é fornecido e não tem uma senha, gera uma nova senha
        if self.google_id and not self.password:
            self.password = User.objects.make_random_password()
        self.email = self.email.lower()

        super(User, self).save(*args, **kwargs)
    
    def __str__(self):
        return self.username


class BookUser(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    availability = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.book.title} - {'Available' if self.availability else 'Unavailable'} by {self.user.username}"