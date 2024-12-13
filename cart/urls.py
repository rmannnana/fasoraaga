from django.urls import path
from .views import view_cart, add_to_cart, remove_from_cart, update_quantity
from manageproducts.views import validate_cart

urlpatterns = [
    path('', view_cart, name='view_cart'),
    path('add/<int:product_id>/', add_to_cart, name='add_to_cart'),
    path('remove/<int:item_id>/', remove_from_cart, name='remove_from_cart'),
    path('update/<int:item_id>/', update_quantity, name='update_quantity'),
    path('validate/', validate_cart, name='validate_cart'),
]
