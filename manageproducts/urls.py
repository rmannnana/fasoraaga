from django.urls import path
from .views import shopView, add_product, edit_shop, edit_product, delete_product, create_order, view_orders, order_detail
from . import views

urlpatterns = [
    path('manage/', shopView, name='shopView'),
    path('add-product/', add_product, name='add_product'),
    path('edit-shop/', edit_shop, name='edit_shop'),
    path('edit-product/<int:product_id>/', edit_product, name='edit_product'),  # URL pour modifier un produit
    path('delete-product/<int:product_id>/', delete_product, name='delete_product'),  # URL pour supprimer un produit
    path('create-order/', create_order, name='create_order'),  # URL pour créer une commande
    path('view-orders/', view_orders, name='view_orders'),
    path('order-detail/<int:order_id>/', order_detail, name='order_detail'),
]
