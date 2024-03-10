import json
from django.http import JsonResponse
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.viewsets import ModelViewSet
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer
from .models import User
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.hashers import check_password, make_password
from notification.models import Notification
from notification.serializers import NotificationSerializer
from chat.models import Message
from chat.serializers import MessageSerializer
from django.db.models import Q


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
        

class UserView(ModelViewSet):
    permission_classes = (IsAuthenticated,)

    serializer_class = UserSerializer  # Corrigido para letra minúscula
    queryset = User.objects.all()
    
    
    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs).data
        
        if response.get("id") is None: return Response(response)
        user = User.objects.filter(id=response.get("id")).first()
        
        refresh_token = str(RefreshToken.for_user(user))
        user_json = UserSerializer(user).data
        user_json['refresh_token'] = refresh_token
        del user_json['google_id']
        
        return Response(user_json)
        
        
    
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        password = request.data.get('password', None)

        mutable_data = request.data.copy()

        mutable_data['is_active'] = True
        
        if password:
            mutable_data['password'] = make_password(password)

        serializer = self.get_serializer(instance, data=mutable_data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}
            
        refresh_token = str(RefreshToken.for_user(request.user))
        data = serializer.data.copy()
        data["refresh_token"] = refresh_token
        log(data)

        return Response(data)

    
    def get_permissions(self):
        """
        Define permissões personalizadas para diferentes métodos da view.
        """
        alow = ['login', 'create', 'google_signup', 'post', 'notifications']
        if self.action in alow:
            permission_classes = [AllowAny]
        elif self.action == 'list' or self.action == 'retrieve':
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAuthenticated]  # Ou outra permissão padrão
            
        return [permission() for permission in permission_classes]
    
     
    @action(detail=False, methods=['post'], url_path='signup/googleaccount')
    def google_signup(self, request):
        
        if len(request.POST) > 0:
            user, status = User.objects.create_by_google(request.POST)
            print('POST')
        else:
            user, status = User.objects.create_by_google(request.data)
            print('data')
            
        if user is None:
            return JsonResponse({
                "status": "error", 
                "message": status
            })
        
        user_json = UserSerializer(user).data
        refresh_token = str(RefreshToken.for_user(user))
        user_json['refresh_token'] = refresh_token
        del user_json['google_id']
        
        data = {
            "status": "success", 
            "user": user_json, 
        }
        print(data)
        return Response(data)
    
    
    @action(detail=True, methods=['get'])
    def notifications(self, request, *args, **kwargs):
        user = self.get_object()
        
        queryset = Notification.objects.filter(user=user, visualized=False)
        notifications_data = NotificationSerializer(queryset, many=True).data
        queryset.update(visualized=True)
        
        return Response(notifications_data)
    
    
    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated, ])
    def messageboxes(self, request, *args, **kwargs):
        sender = self.get_object()
        
        queryset = Message.objects.filter(reciever=request.user, sender=sender).exclude(status=Message.STATUS_RECIVED_BY_RECEIVER)
        messages_data = MessageSerializer(queryset, many=True).data
        queryset.update(status=Message.STATUS_RECIVED_BY_RECEIVER)
        
        return Response(messages_data)
    
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, ])
    def sendmessage(self, request, *args, **kwargs):
        to = self.get_object()
        
        message = Message.objects.create(
            sender=request.user,
            reciever=to,
            message=request.data.get('message')
        )
        
        Notification.objects.create(
            user = to,
            from_field = f"chatPage::{request.user.id}",
            message = f"Você tem uma nova mensagem de {request.user.username}",
            title = "Nova mensagem",
            description = f"Você tem uma nova mensagem de {request.user.username}, ela diz: '{message}'",
        )
        
        message_data = MessageSerializer(message).data
        
        return Response(message_data)
    
    
    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated, ])
    def all_messages(self, request, *args, **kwargs):
        sender = self.get_object()
        
        queryset = Message.objects.filter(Q(sender=request.user, reciever=sender) | Q(reciever=request.user, sender=sender))
        messages_data = MessageSerializer(queryset, many=True).data
        queryset.filter(reciever=request.user).update(status=Message.STATUS_RECIVED_BY_RECEIVER)
        
        return Response(messages_data)
    
    
    @action(detail=True, methods=['get'])
    def notifications_all(self, request, *args, **kwargs):
        user = self.get_object()
        
        queryset = Notification.objects.filter(user=user).order_by("visualized")
        notifications_data = NotificationSerializer(queryset, many=True).data
        queryset.update(visualized=True)
        
        return Response(notifications_data)
    
    
    @action(detail=False, methods=['post'], url_path='login')
    def login(self, request):
        
        if len(request.POST) > 0:
            data = request.POST
            print('POST')
        else:
            data = request.data
            print('data')
        
        print(data)
        
        user = User.objects.filter(email=data['email'].lower()).first()
        
        if not user:
            user = User.objects.filter(username=data['email']).first()
            
        if user:
            if check_password(password=data["password"], encoded=user.password):
                user_json = UserSerializer(user).data
                refresh_token = str(RefreshToken.for_user(user))
                user_json['refresh_token'] = refresh_token
                return Response({"status": "success", "user": user_json})
            else:
                return JsonResponse({"status": "error", "message": "Senha incorreta!"})
        else:
            return JsonResponse({"status": "error", "message": "Email ou username incorreto!"})
