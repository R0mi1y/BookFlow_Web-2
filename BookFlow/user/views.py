import json
from django.http import JsonResponse
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.viewsets import ModelViewSet
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer
from .models import User
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from .serializers import GoogleAccountSerializer
from rest_framework.parsers import JSONParser


class UserView(ModelViewSet):

    permission_classes = (IsAuthenticated,)

    serializer_class = UserSerializer  # Corrigido para letra minúscula
    queryset = User.objects.all()
    
    
    def get_permissions(self):
        """
        Define permissões personalizadas para diferentes métodos da view.
        """
        if self.action == 'create' or self.action == 'google_signup':
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
            return JsonResponse({"status": "error", "message": status})
        
        user_json = UserSerializer(user).data
        user_json["refresh_token"] = str(RefreshToken.for_user(user))
        
        print(str(RefreshToken.for_user(user)))
        
        return Response({"status": "success", "user": user_json})
    
    
    @action(detail=False, methods=['post'], url_path='login')
    def login(self, request):
        
        if len(request.POST) > 0:
            data = request.POST
            print('POST')
        else:
            data = request.data
            print('data')
        
        
        # user_json = UserSerializer(user).data
        # user_json["refresh_token"] = RefreshToken.for_user(user)
        # return Response({"status": "success", "user": user_json})