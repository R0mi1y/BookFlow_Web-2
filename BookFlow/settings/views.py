from django.shortcuts import render
from .models import Settings
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from .serializers import SettingsSerializer


class SettingsView(ModelViewSet):

    permission_classes = (IsAuthenticated,)

    serializer_class = SettingsSerializer  # Corrigido para letra minúscula
    queryset = Settings.objects.all()