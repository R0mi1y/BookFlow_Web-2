from django.db import models
from user.models import User


class Message(models.Model):
    STATUS_RECIVED_BY_SERVER = 1
    STATUS_RECIVED_BY_RECEIVER = 2
    
    message = models.TextField(max_length=300)
    sent_at = models.DateTimeField(auto_now=True)
    sender = models.ForeignKey(User, related_name="sender", on_delete=models.CASCADE)
    reciever = models.ForeignKey(User, related_name="reciever", on_delete=models.CASCADE)
    status = models.IntegerField(default=STATUS_RECIVED_BY_SERVER)