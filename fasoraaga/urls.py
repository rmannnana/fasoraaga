from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from apps.directory.views import EnterpriseViewSet, ProductCategoryViewSet, ProductViewSet, SearchView, SubSectorViewSet
from apps.engagement.views import ContactRequestViewSet, ConversationViewSet, FavoriteViewSet, NotificationViewSet

router = DefaultRouter()
router.register("sub-sectors", SubSectorViewSet, basename="sub-sector")
router.register("categories", ProductCategoryViewSet, basename="category")
router.register("enterprises", EnterpriseViewSet, basename="enterprise")
router.register("products", ProductViewSet, basename="product")
router.register("favorites", FavoriteViewSet, basename="favorite")
router.register("contact-requests", ContactRequestViewSet, basename="contact-request")
router.register("conversations", ConversationViewSet, basename="conversation")
router.register("notifications", NotificationViewSet, basename="notification")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/auth/", include("apps.accounts.urls")),
    path("api/profile/", include("apps.accounts.profile_urls")),
    path("api/search/", SearchView.as_view(), name="search"),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/schema/swagger-ui/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("api/", include(router.urls)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
