from rest_framework.renderers import JSONRenderer
from rest_framework import permissions
from rest_framework.viewsets import ModelViewSet
from .serializers import BookSerializer, CommentSerializer
from .models import Book, Comment
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from user.models import User
from django.db.models import Q
from django.conf import settings
from django.http import QueryDict
import uuid
import logging
import os
import json


logger = logging.getLogger(__name__)

ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'gif'}
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


class MinhaPermissaoPersonalizada(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_superuser


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """
    def has_object_permission(self, request, view, obj):
        # Permissions are only allowed for the owner of the object.
        return obj.owner == request.user


def log(msm): 
    log_path_json = os.path.join(settings.MEDIA_ROOT, 'log.json')

    # Lê o conteúdo atual do arquivo de log JSON
    if os.path.exists(log_path_json):
        with open(log_path_json, 'r') as log_file:
            try:
                log_data = json.load(log_file)
            except json.JSONDecodeError:
                log_data = {'logs': []}
    else:
        log_data = {'logs': []}

    # Adiciona o novo erro à lista
    log_data['logs'].append(str(msm))

    # Escreve a lista atualizada de volta ao arquivo JSON
    with open(log_path_json, 'w') as log_file:
        json.dump(log_data, log_file, indent=2)


@method_decorator(csrf_exempt, name='dispatch')
class BookView(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    serializer_class = BookSerializer
    queryset = Book.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = {
        'title': ['exact', 'icontains'],  # Filtrar por título exato ou parcial (case-insensitive)
        'author': ['exact', 'icontains'],  # Filtrar por autor exato ou parcial (case-insensitive)
        'genre': ['exact', 'icontains'],  # Filtrar por gênero exato ou parcial (case-insensitive)
        'rating': ['exact', 'gte'],  # Filtrar por classificação exata ou maior que (gte - greater than or equal to)
        'availability': ['exact'],  # Filtrar por disponibilidade
    }
    renderer_classes = [JSONRenderer]
    
    
    def get_queryset(self):
        queryset = Book.objects.all()
        search_query = self.request.query_params.get('search', None)

        if search_query:
            queryset = queryset.filter(
                Q(title__icontains=search_query) |
                Q(author__icontains=search_query) |
                Q(genre__icontains=search_query)
            )[:20]

        return queryset
    
    
    def form_valid(self, form):
        form.instance.usuario = self.request.user
        return super().form_valid(form)
    
    @action(detail=True, methods=['post'])
    def wishlist(self, request, pk=None):
        book = self.get_object()
        user = request.user

        if book.is_in_wishlist:
            user.wishlist.remove(book)
            book.is_in_wishlist = False
            book.save()
            return Response({'status': 'Removido da lista de desejos'})
        else:
            user.wishlist.add(book)
            book.is_in_wishlist = True
            book.save()
            return Response({'status': 'Adicionado à lista de desejos'})
    
    @action(detail=False, methods=['get'], url_path=r'user/(?P<id>\d+)')
    def get_by_user(self, request, id):
        filter_name = request.GET.get('filter')
        user = request.user
        
        try:
            if filter_name == "WISHLIST":
                # user = User.objects.get(id=id)
                serialized_books = self.serializer_class(user.wishlist.all(), many=True).data
                return Response(serialized_books)
                
            if filter_name == "POPULARS":
                books = self.serializer_class(Book.objects.order_by('-rating')[:10], many=True).data
                return Response(books)
            
            if filter_name == "PENDING":
                return Response([])
            
            books = self.serializer_class(Book.objects.filter(owner_id=id), many=True).data
            return Response(books)
            
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)


class CommentView(ModelViewSet):

    permission_classes = (permissions.IsAuthenticated,)
    filter_backends = [DjangoFilterBackend]
    serializer_class = CommentSerializer  
    queryset = Comment.objects.all() 
    
    