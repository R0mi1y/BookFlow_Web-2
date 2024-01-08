from .models import Book, Comment
from rest_framework.serializers import ModelSerializer

class BookSerializer(ModelSerializer):

    class Meta:
        model = Book
        fields = '__all__'
        
        
class CommentSerializer(ModelSerializer):

    class Meta:
        model = Comment
        fields = '__all__'