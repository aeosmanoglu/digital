from django.contrib import admin

from .models import App, Category


class AppAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'category', 'url', 'clicks', 'created_at', 'is_new')


admin.site.register(App, AppAdmin)
admin.site.register(Category)
