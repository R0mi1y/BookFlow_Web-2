# Generated by Django 5.0.1 on 2024-01-05 23:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('book', '0004_alter_book_rating'),
    ]

    operations = [
        migrations.AddField(
            model_name='book',
            name='cover',
            field=models.ImageField(blank=True, default=None, null=True, upload_to='book_cover/'),
        ),
    ]
