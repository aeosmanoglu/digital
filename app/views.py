from django.http import HttpResponseRedirect, JsonResponse
from django.shortcuts import render

from .models import App


def get_apps(request):
    apps = App.objects.all()
    data = {'apps': [{
        'id': app.id,
        'name': app.name,
        'abbreviation': app.abbreviation,
        'category': app.category.name,
        'url': app.url,
        'clicks': app.clicks,
        'is_new': app.is_new().__str__()} for app in apps]}

    return JsonResponse(data)


def increase_clicks(request, pk):
    app = App.objects.get(pk=pk)
    app.clicks += 1
    app.save()
    return HttpResponseRedirect(app.url)


def changelog(request):
    return render(request, 'changelog.html')
