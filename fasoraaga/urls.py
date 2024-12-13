from django.conf import settings
from django.contrib import admin
from django.conf.urls.static import static
from django.urls import path, include
from users import views as user_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('users/', include('users.urls')),
    path('manageproducts/', include('manageproducts.urls')),
    path('market/', include('market.urls')),
    path('myaccount/', include('myaccount.urls')),
    path('cart/', include('cart.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)