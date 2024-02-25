# Generated by Django 5.0.1 on 2024-02-06 00:40

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('from_field', models.CharField(max_length=255)),
                ('message', models.TextField()),
                ('title', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('visualized', models.BooleanField()),
            ],
        ),
    ]
