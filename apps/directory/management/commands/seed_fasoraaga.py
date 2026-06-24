from django.core.management.base import BaseCommand

from apps.accounts.models import Role
from apps.directory.models import ProductCategory, SubSector


class Command(BaseCommand):
    help = "Cree les roles, secteurs et categories de base FasoRaaga."

    def handle(self, *args, **options):
        roles = ["Producteur", "Eleveur", "Artisan", "Acheteur", "Transformateur", "Exportateur", "Administrateur"]
        sectors = {
            "Agriculture": ["Cereales", "Fruits", "Legumes", "Oleagineux"],
            "Elevage": ["Betail", "Volaille", "Produits laitiers"],
            "Artisanat": ["Textile", "Bijoux", "Decoration", "Maroquinerie"],
            "Transformation": ["Produits transformes", "Boissons locales", "Epices"],
        }

        for role in roles:
            Role.objects.get_or_create(name=role)

        for sector_name, categories in sectors.items():
            sector, _ = SubSector.objects.get_or_create(name=sector_name)
            for category_name in categories:
                ProductCategory.objects.get_or_create(name=category_name, sub_sector=sector)

        self.stdout.write(self.style.SUCCESS("Donnees FasoRaaga initialisees."))
