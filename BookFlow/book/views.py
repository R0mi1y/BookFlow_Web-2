from rest_framework.renderers import JSONRenderer
from rest_framework import permissions
from rest_framework.viewsets import ModelViewSet
from .serializers import BookSerializer, CommentSerializer
from .models import Book, Comment
from django.views.decorators.csrf import csrf_exempt
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from user.models import User, Loan
from django.db.models import Q
from django.http import Http404, HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework.filters import SearchFilter
from user.serializers import UserSerializer
from functools import reduce
from operator import or_
import qrcode
import io

def log(msm): 
    from django.conf import settings
    import os
    import json
    
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
        
        
class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """
    def has_object_permission(self, request, view, obj):
        # Permissions are only allowed for the owner of the object.
        if request.method == "GET":
            return True
        
        return obj.owner == request.user if obj.owner else False


@method_decorator(csrf_exempt, name='dispatch')
class BookView(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    serializer_class = BookSerializer
    queryset = Book.objects.all()
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = {
        'title': ['exact', 'icontains'],
        'author': ['exact', 'icontains'],
        'genre': ['exact', 'icontains'],
        'rating': ['exact', 'gte'],
        'availability': ['exact'],
    }
    search_fields = ['title', 'author', 'genre']  # Adicione isso para pesquisa

    renderer_classes = [JSONRenderer]
    
    
    def form_valid(self, form):
        form.instance.usuario = self.request.user
        return super().form_valid(form)
    
    
    def get_queryset(self):
        queryset = Book.objects.all()
        search_query = self.request.query_params.get('search', None)

        if search_query and any(search_query):
            lower_search_query = search_query.lower()
            
            if lower_search_query == 'ficção':
                search_query = [search_query, "fiction"]
            elif lower_search_query == 'criminal':
                search_query = [search_query, "crime", 'policia', 'criminalidade']
            elif lower_search_query == 'infantil':
                search_query = [search_query, 'crianças', 'kid', 'infância']
            elif lower_search_query == 'aventura':
                search_query = [search_query, "adventure", 'ação', 'viagem']
            elif lower_search_query == 'biografia':
                search_query = [search_query, "biography", 'vida']
            
            conditions = reduce(or_, [Q(title__icontains=term) | Q(author__icontains=term) | Q(genre__icontains=term) for term in search_query])
            
            queryset = queryset.filter(conditions)
            
            for i in queryset:
                log((i.title))

        return queryset
    

    def list(self, request, *args, **kwargs):
        try:
            if request.user.is_authenticated:
                queryset = self.get_queryset().exclude(owner=request.user)
            else:
                queryset = self.get_queryset()

            data = self.get_serializer(queryset, many=True).data
            
            # Adicione suas lógicas personalizadas aqui, se necessário
            if request.user.is_authenticated:
                data_with_wishlist_info = []
                for item in data:
                    item['is_in_wishlist'] = request.user.wishlist.filter(pk=item['id']).exists()
                    item['is_required'] = Loan.objects.filter(user=request.user, book=item['id']).exists()
                    data_with_wishlist_info.append(item)

                return Response(data_with_wishlist_info)
            else:
                return Response(data)
        except Http404:
            return Response({'error': 'Nenhum livro encontrado'}, status=404)
        
        
    @action(detail=False, methods=['get'], url_path=r'maps', permission_classes=[permissions.AllowAny])
    def map(self, request, *args, **kwargs):
        users = User.objects.all()
        dataset = []
        
        for u in users:
            if u.lat is None or u.lon is None:
                continue
            
            books = Book.objects.filter(owner=u)
            
            if books.exists():
                user_data = UserSerializer(u).data  # Obtém os dados serializados do usuário
                
                user_data['books'] = BookSerializer(books, many=True).data
                dataset.append(user_data)

        return Response(dataset)
        
        
    def retrieve(self, request, *args, **kwargs):
        try:
            instance = get_object_or_404(Book, pk=kwargs['pk'])
            serializer = self.get_serializer(instance)
            data = serializer.data

            # Adicione suas lógicas personalizadas aqui, se necessário
            if request.user.is_authenticated:
                data['is_in_wishlist'] = request.user.wishlist.filter(pk=instance.id).exists()
                data['is_required'] = Loan.objects.filter(user=request.user, book=instance).exists()
            else:
                data['is_in_wishlist'] = False
                data['is_required'] = False

            return Response(data)
        except Http404:
            return Response({'error': 'Livro não encontrado'}, status=404)
    
    
    @action(detail=True, methods=['get'], permission_classes=[IsOwnerOrReadOnly])
    def aprove_loan(self, request, pk=None):
        book = self.get_object()
        
        if book:
            loan = Loan.objects.filter(book=book)
            
            if loan and loan.status == "Requisitado":
                loan.status = "Aceito"
                loan.save()
        
                return Response({"Error": "'LoanSerializer' não existe."})
            else:
                return Response({"error": "Requisição de empréstimo incoerente.", "code": "loan_wrong"}, status=404)
        return Response({"error": "Livro não encontrado.", "code": "book_unfound"}, status=404)

        
    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def request_loan(self, request, pk=None):
        book = self.get_object()
        user = request.user
        
        if book:
            if not Loan.objects.filter(book=book, user=user).exclude(status="Concluído").exists():
                Loan.objects.create(
                    book=book, user=user, status="Requisitado"
                )
                book.status="Requisitado"
                book.save()
            
            book = self.serializer_class(book).data
            log(book)
            
            book['is_in_wishlist'] = request.user.wishlist.filter(id=book['id']).exists()
            book['is_required'] = Loan.objects.filter(user=request.user, book=book['id']).exists()
            
            return Response(book)
        else:
            return Response({"error": "Livro não encontrado", "code": "book_unfound"}, status=404)
        
        
    @action(detail=True, methods=['get'])
    def get_qr(self, request, pk=None):
        book = self.get_object()
        user = book.owner

        # Criar conteúdo para o QR Code
        qr_content = f"Contato do dono: WhatsApp - {user.phone}, E-mail - {user.email}. BOOKID::{book.id}"

        # Criar o objeto QR Code
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(qr_content)
        qr.make(fit=True)

        # Criar a imagem QR Code
        img = qr.make_image(fill_color="black", back_color="white")
        
        if request.GET.get('result') == 'show':
            img_bytes = io.BytesIO()
            img.save(img_bytes, format='PNG')
            return HttpResponse(img_bytes.getvalue(), content_type='image/png')

        # Converter a imagem em bytes
        img_bytes = io.BytesIO()
        img.save(img_bytes, format='PNG')

        # Retornar a resposta com a imagem em bytes
        response = HttpResponse(img_bytes.getvalue(), content_type='image/png')
        response['Content-Disposition'] = f'attachment; filename=qr_code.png'
        return response
    
        
    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def wishlist(self, request, pk=None):
        book = self.get_object()
        user = request.user

        if user.wishlist.filter(pk=book.pk).exists():
            user.wishlist.remove(book)
            return Response({'status': 'Removido da lista de desejos'})
        else:
            user.wishlist.add(book)
            return Response({'status': 'Adicionado à lista de desejos'})
    
    
    @action(detail=False, methods=['get'], url_path=r'user/(?P<id>\d+)', permission_classes=[permissions.IsAuthenticated])
    def get_by_user(self, request, id):
        filter_name = request.GET.get('filter')
        user = request.user
        books = self.serializer_class(Book.objects.filter(owner_id=id), many=True, context={'request': request}).data
        
        try:
            if filter_name == "WISHLIST" and user.is_authenticated:
                books = self.serializer_class(user.wishlist.all(), many=True).data
                
            elif filter_name == "POPULARS":
                books = self.serializer_class(Book.objects.exclude(owner=request.user).order_by('-rating')[:10], many=True).data
            
            elif filter_name == "ALL":
                books = self.serializer_class(Book.objects.order_by('-rating')[:30], many=True).data
            
            elif filter_name == "PENDING":
                books = self.serializer_class(user.wishlist.filter(availability=False), many=True).data
                
            elif filter_name == "REQUIRED_BY_ME":
                loans = Loan.objects.filter(user=request.user, status="Requisitado")
                books = [self.serializer_class(loan.book).data for loan in loans]
                
            elif filter_name == "CLOSER":
                users = User.objects.filter(postal_code=request.user.postal_code)
                books = self.serializer_class(Book.objects.filter(owner__in=users).exclude(owner=request.user).order_by('-rating')[:30], many=True).data
                
            elif filter_name == "REQUIRED":
                loans = Loan.objects.filter(status="Requisitado")
                books = [self.serializer_class(loan.book).data for loan in loans if loan.book.owner == request.user]
            
            for book in books:
                book_id = book.get('id')

                if request.user.is_authenticated:
                    book['is_in_wishlist'] = request.user.wishlist.filter(pk=book_id).exists()
                    book['is_required'] = Loan.objects.filter(user=request.user, book=book_id).exists()
                else:
                    book['is_in_wishlist'] = False
                    book['is_required'] = False
                    
            return Response(books)
            
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)


class CommentView(ModelViewSet):
    permission_classes = (permissions.IsAuthenticated,)
    filter_backends = [DjangoFilterBackend]
    serializer_class = CommentSerializer  
    queryset = Comment.objects.all() 
    
    