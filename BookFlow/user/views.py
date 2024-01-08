import json
from django.http import JsonResponse
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.viewsets import ModelViewSet
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
        else:
            user, status = User.objects.create_by_google(request.data)
            
        if user is None:
            return JsonResponse({"status": "error", "message": status})
        
        return Response({"status": "success", "user": UserSerializer(user).data})