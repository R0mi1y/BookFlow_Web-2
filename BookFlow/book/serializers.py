from .models import Book, Comment
from rest_framework.serializers import ModelSerializer

class BookSerializer(ModelSerializer):

    def get_is_in_wishlist(self, book):
        request = self.context.get('request')
        if request:
            user = request.user
            if user and hasattr(user, 'wishlist'):
                return user.wishlist.filter(pk=book.pk).exists()
        return False
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['is_in_wishlist'] = self.get_is_in_wishlist(instance)

        return representation
    
    class Meta:
        model = Book
        fields = '__all__'
        
        
class CommentSerializer(ModelSerializer):

    class Meta:
        model = Comment
        fields = '__all__'