from rest_framework import serializers

from .models import Enterprise, Product, ProductCategory, ProductImage, SubSector


class SubSectorSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubSector
        fields = ["id", "name", "description"]


class ProductCategorySerializer(serializers.ModelSerializer):
    sub_sector_name = serializers.CharField(source="sub_sector.name", read_only=True)

    class Meta:
        model = ProductCategory
        fields = ["id", "name", "description", "sub_sector", "sub_sector_name"]


class EnterpriseSerializer(serializers.ModelSerializer):
    owner_email = serializers.EmailField(source="owner.email", read_only=True)
    product_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Enterprise
        fields = [
            "id",
            "owner",
            "owner_email",
            "name",
            "description",
            "logo",
            "email",
            "phone",
            "website",
            "region",
            "province",
            "commune",
            "address",
            "product_count",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "owner", "owner_email", "product_count", "created_at", "updated_at"]


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["id", "image", "alt_text", "created_at"]
        read_only_fields = ["id", "created_at"]


class ProductSerializer(serializers.ModelSerializer):
    enterprise_name = serializers.CharField(source="enterprise.name", read_only=True)
    category_name = serializers.CharField(source="category.name", read_only=True)
    sub_sector = serializers.CharField(source="category.sub_sector.name", read_only=True)
    region = serializers.CharField(source="enterprise.region", read_only=True)
    province = serializers.CharField(source="enterprise.province", read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "enterprise",
            "enterprise_name",
            "category",
            "category_name",
            "sub_sector",
            "region",
            "province",
            "name",
            "description",
            "indicative_price",
            "unit",
            "quantity_available",
            "images",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "enterprise", "enterprise_name", "sub_sector", "region", "province", "created_at", "updated_at"]
