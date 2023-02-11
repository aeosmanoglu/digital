from django.urls import path
from .views import apps_view, increase_clicks

urlpatterns = [
    path('', apps_view, name='apps_view'),
    path('<int:pk>/click/', increase_clicks, name='increase_clicks'),
]
