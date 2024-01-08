from rest_framework import permissions
from rest_framework.viewsets import ModelViewSet
from .serializers import BookSerializer, CommentSerializer
from .models import Book, Comment


class MinhaPermissaoPersonalizada(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_superuser

class BookView(ModelViewSet):

    permission_classes = (permissions.IsAuthenticated, MinhaPermissaoPersonalizada)

    serializer_class = BookSerializer  # Corrigido para letra minúscula
    queryset = Book.objects.all()
    
    
class CommentView(ModelViewSet):

    permission_classes = (permissions.IsAuthenticated,)

    serializer_class = CommentSerializer  # Corrigido para letra minúscula
    queryset = Comment.objects.all()