from django.urls import path
from .views import myaccount, create_shop

urlpatterns = [
    path('', myaccount, name='myaccount'),
    path('create-shop/', create_shop, name='create_shop'),
]
