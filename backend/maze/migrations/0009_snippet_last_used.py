# Generated by Django 4.2.5 on 2023-12-09 07:54

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("maze", "0008_alter_runresult_run_error"),
    ]

    operations = [
        migrations.AddField(
            model_name="snippet",
            name="last_used",
            field=models.DateTimeField(auto_now=True),
        ),
    ]
