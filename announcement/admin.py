from django.contrib import admin

from .models import Announcement


class AnnouncementAdmin(admin.ModelAdmin):
    list_display = ('name', 'sub_title', 'end_date', 'created_at', 'updated_at')


admin.site.register(Announcement, AnnouncementAdmin)
