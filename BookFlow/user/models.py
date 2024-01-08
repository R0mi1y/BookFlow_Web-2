from django.contrib.auth.models import AbstractUser
from django.db import models
from book.models import Book

class User(AbstractUser):
    photo = models.ImageField(upload_to='profile_photos/', null=True, blank=True)
    phone = models.CharField(max_length=15, null=True, blank=True)
    account_type = models.CharField(max_length=255)
    active = models.BooleanField(default=True)
    biography = models.TextField(null=True, blank=True)
    street = models.CharField(max_length=255, null=True, blank=True)
    city = models.CharField(max_length=255, null=True, blank=True)
    state = models.CharField(max_length=255, null=True, blank=True)
    postal_code = models.CharField(max_length=20, null=True, blank=True)
    wishlist = models.ManyToManyField(Book, related_name='user_wishlist', blank=True)
    
    
    def __str__(self):
        return self.username


class BookUser(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    availability = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.book.title} - {'Available' if self.availability else 'Unavailable'} by {self.user.username}"