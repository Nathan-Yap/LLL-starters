from django.urls import path
from . import views

urlpatterns = [
    path('', views.lobby),
    path('test', views.test_transcript)
]