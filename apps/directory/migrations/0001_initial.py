import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="SubSector",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=120, unique=True)),
                ("description", models.TextField(blank=True)),
            ],
            options={"ordering": ["name"]},
        ),
        migrations.CreateModel(
            name="Enterprise",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=180)),
                ("description", models.TextField(blank=True)),
                ("logo", models.ImageField(blank=True, null=True, upload_to="enterprises/logos/")),
                ("email", models.EmailField(blank=True, max_length=254)),
                ("phone", models.CharField(blank=True, max_length=30)),
                ("website", models.URLField(blank=True)),
                ("region", models.CharField(blank=True, max_length=120)),
                ("province", models.CharField(blank=True, max_length=120)),
                ("commune", models.CharField(blank=True, max_length=120)),
                ("address", models.CharField(blank=True, max_length=255)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("owner", models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name="enterprise", to=settings.AUTH_USER_MODEL)),
            ],
            options={"ordering": ["name"]},
        ),
        migrations.CreateModel(
            name="ProductCategory",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=120)),
                ("description", models.TextField(blank=True)),
                ("sub_sector", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="categories", to="directory.subsector")),
            ],
            options={"ordering": ["name"], "verbose_name_plural": "product categories"},
        ),
        migrations.CreateModel(
            name="Product",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=180)),
                ("description", models.TextField(blank=True)),
                ("indicative_price", models.DecimalField(decimal_places=2, max_digits=12)),
                ("unit", models.CharField(choices=[("kg", "kg"), ("tonne", "tonne"), ("litre", "litre"), ("piece", "piece"), ("tete", "tete"), ("sac", "sac"), ("autre", "autre")], default="kg", max_length=20)),
                ("quantity_available", models.DecimalField(blank=True, decimal_places=2, max_digits=12, null=True)),
                ("status", models.CharField(choices=[("disponible", "disponible"), ("sur_commande", "sur commande"), ("indisponible", "indisponible")], default="disponible", max_length=30)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("category", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="products", to="directory.productcategory")),
                ("enterprise", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="products", to="directory.enterprise")),
            ],
            options={"ordering": ["-created_at"]},
        ),
        migrations.CreateModel(
            name="ProductImage",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("image", models.ImageField(upload_to="products/")),
                ("alt_text", models.CharField(blank=True, max_length=180)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("product", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="images", to="directory.product")),
            ],
            options={"ordering": ["id"]},
        ),
        migrations.AddIndex(model_name="product", index=models.Index(fields=["name"], name="directory_p_name_8f6953_idx")),
        migrations.AddIndex(model_name="product", index=models.Index(fields=["status"], name="directory_p_status_89a5d_idx")),
        migrations.AddConstraint(model_name="productcategory", constraint=models.UniqueConstraint(fields=("name", "sub_sector"), name="unique_category_per_sub_sector")),
    ]
