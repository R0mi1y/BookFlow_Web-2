from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext as _
from .managers import UserManager


class User(AbstractUser):
    google_id = models.CharField(null=True, blank=True, max_length=255)
    photo = models.ImageField(upload_to='profile_photos/', null=True, blank=True)
    photo_url = models.URLField(max_length=1000, blank=True, null=True)
    phone = models.CharField(max_length=15, null=True, blank=True)
    account_type = models.CharField(max_length=255, default="common_user")
    email = models.EmailField(_("email address"), blank=True, unique=True)
    biography = models.TextField(null=True, blank=True)
    street = models.CharField(max_length=255, null=True, blank=True)
    house_number = models.CharField(max_length=255, null=True, blank=True)
    city = models.CharField(max_length=255, null=True, blank=True)
    district = models.CharField(max_length=255, null=True, blank=True, default=None)
    state = models.CharField(max_length=255, null=True, blank=True)
    postal_code = models.CharField(max_length=20, null=True, blank=True)
    wishlist = models.ManyToManyField('book.Book', related_name='user_wishlist', blank=True)
    lat = models.CharField(max_length=255, null=True, blank=True)
    lon = models.CharField(max_length=255, null=True, blank=True)
    notification_token = models.CharField(max_length=255, null=True, blank=True, default=None)

    objects = UserManager()
    
    
    def save(self, *args, **kwargs):
        # Se o google_id é fornecido e não tem uma senha, gera uma nova senha
        if self.google_id and not self.password:
            self.password = User.objects.make_random_password()
        self.email = self.email.lower()

        super(User, self).save(*args, **kwargs)
    
    def __str__(self):
        return self.username
    

class Loan(models.Model):
    status = models.CharField(null=True, blank=True, max_length=25)
    book = models.ForeignKey('book.Book', null=True, blank=True, on_delete=models.CASCADE)
    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.CASCADE)
    