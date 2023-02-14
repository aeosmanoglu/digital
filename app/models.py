from datetime import timedelta

from django.db import models
from django.utils import timezone


class Category(models.Model):
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class App(models.Model):
    name = models.CharField(max_length=255)
    abbreviation = models.CharField(max_length=10, blank=True, null=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    url = models.URLField()
    clicks = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.name

    def is_new(self):
        return self.created_at > timezone.now() - timedelta(days=3)
