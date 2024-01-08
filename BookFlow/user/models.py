from django.contrib.auth.models import AbstractUser
from django.db import IntegrityError, models
from django.forms import ValidationError
from book.models import Book
from django.utils.translation import gettext as _
import re
from django.contrib.auth.hashers import make_password
from django.utils.crypto import get_random_string


class UserManager(models.Manager):
    def create_by_google(self, json):
        user = User.objects.filter(email=json['email']).first()

        if user:
            return user, False 
        else:
            try:
                new_user = User.objects.create(
                    email=json['email'],
                    username=json['name'],
                    first_name=json['given_name'],
                    last_name=json['family_name'],
                    photo_url=json['picture'],
                )
                
                print("Creating new user")
                
                return new_user, True  # Retorna o novo usuário e um sinalizador indicando que foi criado
            except IntegrityError as e:
                error_message = e.args[1]
                if "Duplicate entry" in error_message:
                    camp = re.search(r"for key '(\w+)'", error_message)
                    
                    return None, f"Um usuário com esse {camp.group(1)} já existe!"

            except ValidationError as e:
                # Captura erros de validação de dados
                return None, str(e.args)

            except Exception as e:
                # Captura outras exceções genéricas
                return None, f"Error: {str(e)}"


class User(AbstractUser):
    google_id = models.CharField(null=True, blank=True, max_length=255)
    photo = models.ImageField(upload_to='profile_photos/', null=True, blank=True)
    photo_url = models.URLField(max_length=255, blank=True, null=True)
    phone = models.CharField(max_length=15, null=True, blank=True)
    account_type = models.CharField(max_length=255)
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
    
    
    def save(self, *args, **kwargs):
        # Se o google_id é fornecido e não tem uma senha, gera uma nova senha
        if self.google_id and not self.password:
            random_password = get_random_string(length=12)
            self.password = make_password(random_password)

        super(User, self).save(*args, **kwargs)
    
    def __str__(self):
        return self.username


class BookUser(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    availability = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.book.title} - {'Available' if self.availability else 'Unavailable'} by {self.user.username}"