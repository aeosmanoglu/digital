from django.views.generic import ListView

from .models import Document


class DocumentListView(ListView):
    model = Document
    template_name = 'document_list.html'
    context_object_name = 'documents'
