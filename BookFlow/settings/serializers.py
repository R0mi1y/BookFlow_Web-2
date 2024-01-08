from .models import Settings
from rest_framework.serializers import ModelSerializer


class SettingsSerializer(ModelSerializer):

    class Meta:
        model = Settings
        fields = '__all__'
