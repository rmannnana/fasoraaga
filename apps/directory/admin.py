from django.contrib import admin

from .models import Enterprise, Product, ProductCategory, ProductImage, SubSector


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


@admin.register(SubSector)
class SubSectorAdmin(admin.ModelAdmin):
    search_fields = ["name"]


@admin.register(ProductCategory)
class ProductCategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "sub_sector"]
    list_filter = ["sub_sector"]
    search_fields = ["name", "description"]


@admin.register(Enterprise)
class EnterpriseAdmin(admin.ModelAdmin):
    list_display = ["name", "owner", "region", "province", "phone", "created_at"]
    list_filter = ["region", "province"]
    search_fields = ["name", "description", "owner__email", "phone"]


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    inlines = [ProductImageInline]
    list_display = ["name", "enterprise", "category", "indicative_price", "unit", "status"]
    list_filter = ["status", "unit", "category__sub_sector", "category"]
    search_fields = ["name", "description", "enterprise__name"]
