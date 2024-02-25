from django.db.models import Manager
from user.models import User


class BookManager(Manager):
    def send_favorite_notification(self, book):
        users = User.objects.filter(wishlist=book)
        
        for user in users:
            User.objects.send_notification(user, "Livro disponível", f"O livro '{book.title}' está agora disponível para uma troca ou empréstimo!", from_field=f"bookPage::{book.id}")
