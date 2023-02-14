from django.urls import path

from .views import get_apps, increase_clicks, changelog

urlpatterns = [
    path('apps', get_apps, name='get_apps'),
    path('<int:pk>/click/', increase_clicks, name='increase_clicks'),
    path('changelog/', changelog, name='changelog'),
]
