# Generated by Django 5.0.1 on 2024-02-04 18:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0005_alter_user_lat_alter_user_lon'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='notification_token',
            field=models.CharField(blank=True, default=None, max_length=255, null=True),
        ),
    ]
