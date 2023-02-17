from django.contrib import admin

from .models import Announcement


class AnnouncementAdmin(admin.ModelAdmin):
    list_display = ('name', 'end_date', 'created_at', 'updated_at')


admin.site.register(Announcement, AnnouncementAdmin)
