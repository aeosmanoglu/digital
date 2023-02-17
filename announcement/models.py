from django.db import models


class Announcement(models.Model):
    name = models.CharField(max_length=50)
    content = models.TextField()
    url = models.URLField(blank=True, null=True)
    end_date = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
