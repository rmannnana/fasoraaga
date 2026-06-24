from django.db.models import Count, Q
from rest_framework.exceptions import ValidationError
from rest_framework import permissions, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Enterprise, Product, ProductCategory, SubSector
from .permissions import IsEnterpriseOwnerOrReadOnly
from .serializers import EnterpriseSerializer, ProductCategorySerializer, ProductSerializer, SubSectorSerializer


class SubSectorViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SubSector.objects.all()
    serializer_class = SubSectorSerializer
    permission_classes = [permissions.AllowAny]
    search_fields = ["name", "description"]


class ProductCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ProductCategory.objects.select_related("sub_sector")
    serializer_class = ProductCategorySerializer
    permission_classes = [permissions.AllowAny]
    filterset_fields = ["sub_sector"]
    search_fields = ["name", "description", "sub_sector__name"]


class EnterpriseViewSet(viewsets.ModelViewSet):
    serializer_class = EnterpriseSerializer
    permission_classes = [IsEnterpriseOwnerOrReadOnly]
    filterset_fields = ["region", "province", "commune"]
    search_fields = ["name", "description", "region", "province", "commune"]
    ordering_fields = ["name", "created_at", "updated_at"]

    def get_queryset(self):
        return Enterprise.objects.select_related("owner").annotate(product_count=Count("products"))

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = [IsEnterpriseOwnerOrReadOnly]
    filterset_fields = {
        "category": ["exact"],
        "category__sub_sector": ["exact"],
        "enterprise": ["exact"],
        "enterprise__region": ["exact", "icontains"],
        "enterprise__province": ["exact", "icontains"],
        "status": ["exact"],
    }
    search_fields = ["name", "description", "enterprise__name", "category__name", "category__sub_sector__name"]
    ordering_fields = ["created_at", "updated_at", "indicative_price", "name"]

    def get_queryset(self):
        return Product.objects.select_related("enterprise", "category", "category__sub_sector").prefetch_related("images")

    def perform_create(self, serializer):
        enterprise = getattr(self.request.user, "enterprise", None)
        if enterprise is None:
            raise ValidationError("Vous devez configurer votre entreprise avant d'ajouter un produit.")
        serializer.save(enterprise=enterprise)


class SearchView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        query = request.query_params.get("q", "").strip()
        sector = request.query_params.get("sector")
        category = request.query_params.get("category")
        region = request.query_params.get("region")
        province = request.query_params.get("province")

        products = Product.objects.select_related("enterprise", "category", "category__sub_sector").prefetch_related("images")
        enterprises = Enterprise.objects.select_related("owner").annotate(product_count=Count("products"))

        if query:
            products = products.filter(
                Q(name__icontains=query)
                | Q(description__icontains=query)
                | Q(enterprise__name__icontains=query)
                | Q(category__name__icontains=query)
            )
            enterprises = enterprises.filter(Q(name__icontains=query) | Q(description__icontains=query))
        if sector:
            products = products.filter(category__sub_sector_id=sector)
            enterprises = enterprises.filter(products__category__sub_sector_id=sector).distinct()
        if category:
            products = products.filter(category_id=category)
            enterprises = enterprises.filter(products__category_id=category).distinct()
        if region:
            products = products.filter(enterprise__region__icontains=region)
            enterprises = enterprises.filter(region__icontains=region)
        if province:
            products = products.filter(enterprise__province__icontains=province)
            enterprises = enterprises.filter(province__icontains=province)

        return Response(
            {
                "products": ProductSerializer(products[:20], many=True, context={"request": request}).data,
                "enterprises": EnterpriseSerializer(enterprises[:20], many=True, context={"request": request}).data,
            }
        )
