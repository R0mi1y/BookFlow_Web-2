from django.db import models
from django.core.validators import MaxValueValidator
from .managers import BookManager
from django.db.models.signals import pre_save
from django.dispatch import receiver


class Book(models.Model):
    cover = models.ImageField(upload_to='book_cover/', null=True, default=None)
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    genre = models.CharField(max_length=255)  # Usando CharField para armazenar gênero como uma string
    summary = models.TextField()
    status = models.CharField(max_length=255, default="")
    requirements_loan = models.TextField(default="", blank=True)
    rating = models.DecimalField(max_digits=4, decimal_places=2, default=0, null=True, validators=[
        MaxValueValidator(10, message="Certifique-se de que a nota seja de no máximo 10")
    ])  # Usando DecimalField para armazenar a classificação
    availability = models.BooleanField(default=True)
    owner = models.ForeignKey('user.User', related_name="Criador", default=None, null=True, on_delete=models.CASCADE)
    
    objects = BookManager()
    
    def __str__(self):
        return self.title


@receiver(pre_save, sender=Book)
def book_pre_save(sender, instance, **kwargs):
    try:
        old_book = Book.objects.get(pk=instance.pk)
    except Book.DoesNotExist:
        return

    if old_book.availability != instance.availability and instance.availability:
        Book.objects.send_favorite_notification(instance)


class Comment(models.Model):
    user = models.ForeignKey('user.User', on_delete=models.CASCADE, related_name='comments')
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='comments')
    comment_text = models.TextField()
    responding_to = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE, related_name='replies')

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Comment by {self.user.username} on {self.book.title}"

    # You can add custom methods here, for example, a method to check if a comment is a reply
    def is_reply(self):
        return self.responding_to is not None