# FasoRaaga

FasoRaaga est une plateforme B2B de mise en relation pour les producteurs locaux burkinabe, les acheteurs, les exportateurs et les partenaires professionnels.

Ce projet n'est pas une marketplace transactionnelle. Il reproduit l'experience d'un salon professionnel numerique : decouverte d'entreprises, exploration de catalogues, demandes de contact, messagerie et reseau professionnel.

## Stack

- Django
- Django REST Framework
- JWT avec SimpleJWT
- PostgreSQL en production
- Swagger / OpenAPI avec drf-spectacular
- Django Admin

## Demarrage local

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Si `DATABASE_URL` est vide ou absent, Django utilise SQLite pour faciliter le developpement.

## Endpoints utiles

- `POST /api/auth/register/`
- `POST /api/auth/token/`
- `POST /api/auth/token/refresh/`
- `GET /api/profile/`
- `GET /api/enterprises/`
- `GET /api/products/`
- `GET /api/search/?q=mangue`
- `GET /api/favorites/`
- `GET /api/contact-requests/`
- `GET /api/conversations/`
- `GET /api/notifications/`
- `GET /api/schema/swagger-ui/`

## Roadmap MVP

1. Authentification, profil utilisateur, entreprise.
2. Produits, catalogue public, recherche et filtres.
3. Favoris et fiches detaillees.
4. Demandes de contact et messagerie.
5. Notifications, administration et statistiques.
