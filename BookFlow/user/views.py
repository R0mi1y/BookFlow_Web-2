from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from .serializers import UserSerializer
from .models import User
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from .serializers import GoogleAccountSerializer


class UserView(ModelViewSet):

    permission_classes = (IsAuthenticated,)

    serializer_class = UserSerializer  # Corrigido para letra minúscula
    queryset = User.objects.all()
    
    @action(detail=False, methods=['post'], url_path='signup/googleaccount')
    def google_signup(self, request):
        serializer = GoogleAccountSerializer(data=request.data)
        if serializer.is_valid():
            user_data = serializer.validated_data
            user, created = User.objects.update_or_create(
                google_id=user_data['google_id'],
                defaults={'email': user_data['email'], 'username': user_data['name']}
            )
            
            return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)