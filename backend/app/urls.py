from . import views
from django.urls import path,include

urlpatterns = [
    path('hello/', views.hello , name="hello"),
    path("api/v1/auth/", include('djoser.urls')),
    path("api/v1/auth/", include('djoser.urls.jwt')),
]
