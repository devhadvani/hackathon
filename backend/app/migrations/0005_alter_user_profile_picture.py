# Generated by Django 5.0.2 on 2024-04-24 05:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0004_chatmessage'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='profile_picture',
            field=models.ImageField(blank=True, null=True, upload_to='', verbose_name='Profile Picture'),
        ),
    ]
