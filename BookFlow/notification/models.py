from django.db import models

class Notification(models.Model):
    user = models.ForeignKey('user.user', on_delete=models.CASCADE)
    from_field = models.CharField(max_length=255, default='')
    message = models.TextField()
    title = models.CharField(max_length=255)
    description = models.TextField(default='')
    visualized = models.BooleanField(default=False)
    