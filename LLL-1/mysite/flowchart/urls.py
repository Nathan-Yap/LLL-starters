from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('chart', views.chart, name='chart'),
    path('save', views.save, name='save'),
    path('connect', views.connect, name='connect'),
    path('delete', views.delete, name='delete'),
]
