# Generated by Django 4.2.5 on 2023-12-05 02:05

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("accounts", "0001_initial"),
        ("maze", "0005_alter_mazeconfiguration_name"),
    ]

    operations = [
        migrations.CreateModel(
            name="Snippet",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(blank=True, default="", max_length=32)),
                (
                    "profile",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="accounts.profile",
                    ),
                ),
            ],
        ),
        migrations.AddConstraint(
            model_name="snippet",
            constraint=models.UniqueConstraint(
                fields=("name", "profile"), name="maze_snippet_unique"
            ),
        ),
    ]
