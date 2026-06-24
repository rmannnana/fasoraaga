from django.conf import settings
from django.db import models


class SubSector(models.Model):
    name = models.CharField(max_length=120, unique=True)
    description = models.TextField(blank=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class ProductCategory(models.Model):
    name = models.CharField(max_length=120)
    description = models.TextField(blank=True)
    sub_sector = models.ForeignKey(SubSector, on_delete=models.CASCADE, related_name="categories")

    class Meta:
        ordering = ["name"]
        verbose_name_plural = "product categories"
        constraints = [models.UniqueConstraint(fields=["name", "sub_sector"], name="unique_category_per_sub_sector")]

    def __str__(self):
        return self.name


class Enterprise(models.Model):
    owner = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="enterprise")
    name = models.CharField(max_length=180)
    description = models.TextField(blank=True)
    logo = models.ImageField(upload_to="enterprises/logos/", blank=True, null=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=30, blank=True)
    website = models.URLField(blank=True)
    region = models.CharField(max_length=120, blank=True)
    province = models.CharField(max_length=120, blank=True)
    commune = models.CharField(max_length=120, blank=True)
    address = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class Product(models.Model):
    class Unit(models.TextChoices):
        KG = "kg", "kg"
        TONNE = "tonne", "tonne"
        LITRE = "litre", "litre"
        PIECE = "piece", "piece"
        HEAD = "tete", "tete"
        BAG = "sac", "sac"
        OTHER = "autre", "autre"

    class Status(models.TextChoices):
        AVAILABLE = "disponible", "disponible"
        ON_ORDER = "sur_commande", "sur commande"
        UNAVAILABLE = "indisponible", "indisponible"

    enterprise = models.ForeignKey(Enterprise, on_delete=models.CASCADE, related_name="products")
    category = models.ForeignKey(ProductCategory, on_delete=models.PROTECT, related_name="products")
    name = models.CharField(max_length=180)
    description = models.TextField(blank=True)
    indicative_price = models.DecimalField(max_digits=12, decimal_places=2)
    unit = models.CharField(max_length=20, choices=Unit.choices, default=Unit.KG)
    quantity_available = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    status = models.CharField(max_length=30, choices=Status.choices, default=Status.AVAILABLE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["name"]),
            models.Index(fields=["status"]),
        ]

    def __str__(self):
        return self.name


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="products/")
    alt_text = models.CharField(max_length=180, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["id"]
