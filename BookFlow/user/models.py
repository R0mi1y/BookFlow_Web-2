from django.contrib.auth.models import AbstractUser
from django.db import models
from book.models import Book
from django.utils.translation import gettext as _
from .managers import UserManager


class User(AbstractUser):
    google_id = models.CharField(null=True, blank=True, max_length=255)
    photo = models.ImageField(upload_to='profile_photos/', null=True, blank=True)
    photo_url = models.URLField(max_length=1000, blank=True, null=True)
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