from django.contrib import admin

from maze import models

admin.site.register(models.RunResult)
admin.site.register(models.MazeConfiguration)
admin.site.register(models.RobotConfiguration)
admin.site.register(models.Snippet)
