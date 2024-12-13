from django.urls import path
from . import views

urlpatterns = [
    path('home/', views.homeView, name='home'),
    path('marketplace/', views.marketplace, name='marketplace'),
    path('product/<int:product_id>/', views.product_detail, name='product_detail'),
]
