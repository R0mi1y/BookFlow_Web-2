from django.shortcuts import render
from .models import Message
from .serializers import MessageSerializer
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated, AllowAny


class MessageView(ModelViewSet):

    permission_classes = (IsAuthenticated,)

    serializer_class = MessageSerializer
    queryset = Message.objects.all()