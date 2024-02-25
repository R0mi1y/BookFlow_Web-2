from .models import Book, Comment
from rest_framework.serializers import ModelSerializer
import json
import os
from django.conf import settings


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


class BookSerializer(ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'

    def get_is_in_wishlist(self, book):
        request = self.context.get('request', None)
        
        if request:
            user = request.user
            if user and hasattr(user, 'wishlist'):
                return user.wishlist.filter(pk=book.pk).exists()
            else:
                pass
        else:
            pass
        return False
    
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['is_in_wishlist'] = self.get_is_in_wishlist(instance)

        return representation
    
    
        
        
class CommentSerializer(ModelSerializer):

    class Meta:
        model = Comment
        fields = '__all__'