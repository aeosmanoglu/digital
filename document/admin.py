from django.contrib import admin

from .models import Document


class DocumentAdmin(admin.ModelAdmin):
    list_display = ('title', 'file', 'uploaded_at', 'modified_at')


admin.site.register(Document, DocumentAdmin)
