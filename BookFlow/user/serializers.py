from .models import User, BookUser
from rest_framework.serializers import *


class UserSerializer(ModelSerializer):

    class Meta:
        model = User
        fields = '__all__'


class BookUserSerializer(ModelSerializer):

    class Meta:
        model = BookUser
        fields = '__all__'
        
        
class GoogleAccountSerializer(ModelSerializer):
    
    google_id = CharField(required=True)
    email = EmailField(required=True)
    name = CharField(required=True)