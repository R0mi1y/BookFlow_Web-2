# Generated by Django 5.0.1 on 2024-01-21 00:27

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0002_alter_user_account_type_alter_user_city_and_more'),
    ]

    operations = [
        migrations.DeleteModel(
            name='BookUser',
        ),
    ]
