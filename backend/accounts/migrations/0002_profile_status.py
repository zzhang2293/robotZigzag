# Generated by Django 4.2.5 on 2023-12-05 05:54

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("accounts", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="profile",
            name="status",
            field=models.CharField(
                choices=[("user", "user"), ("admin", "admin")],
                default="user",
                max_length=30,
            ),
        ),
    ]