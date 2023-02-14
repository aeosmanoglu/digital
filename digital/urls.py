from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('app/', include('app.urls')),
    path('', include('announcement.urls')),
    path('document/', include('document.urls')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

admin.site.site_header = 'Dijital Yönetim Paneli'
admin.site.site_title = 'Dijital Yönetim Paneli'
admin.site.index_title = 'Dijital Yönetim Paneli'
