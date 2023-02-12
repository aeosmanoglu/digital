from django.utils import timezone
from django.views.generic import ListView

from .models import Announcement


class AnnouncementListView(ListView):
    model = Announcement
    template_name = 'announcement_list.html'

    def get_queryset(self):
        return Announcement.objects.filter(end_date__gte=timezone.now())

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['announcements'] = self.get_queryset()
        return context
