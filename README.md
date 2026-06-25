# FasoRaaga

FasoRaaga est une plateforme B2B de mise en relation pour les producteurs locaux burkinabè, les acheteurs, les exportateurs et les partenaires professionnels.

Le projet reproduit l'expérience d'un salon professionnel numérique : découverte d'entreprises, exploration de catalogues, demandes de contact, messagerie et réseau professionnel.

**Repository layout**

- Backend: racine du projet (Django REST API)
- Frontend: `frontend/` (React + Vite + TypeScript)

**Stack principal**

- Django + Django REST Framework
- JWT (djangorestframework-simplejwt)
- drf-spectacular (OpenAPI / Swagger)
- PostgreSQL (production) — SQLite en développement possible
- React + Vite + TypeScript (frontend)

## Prérequis

- Python (3.10+ recommandé)
- Node.js (v18+ recommandé) pour le frontend
- Git

## Configuration locale (backend)

1. Créez et activez un environnement virtuel :

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1  # PowerShell
```

```bash
python -m venv .venv
source .venv/bin/activate    # macOS / Linux
```

2. Installez les dépendances :

```bash
pip install -r requirements.txt
```

3. Copiez l'exemple d'environnement et ajustez les variables si besoin :

```bash
copy .env.example .env       # Windows (PowerShell/CMD)
cp .env.example .env         # macOS / Linux
```

Par défaut, si `DATABASE_URL` est vide, le projet utilise SQLite (fichier `db.sqlite3`). Pour utiliser PostgreSQL, renseignez `DATABASE_URL` dans `.env` (format standard PostgreSQL).

4. Appliquez les migrations et créez un super‑utilisateur :

```bash
python manage.py migrate
python manage.py createsuperuser
```

5. Démarrez le serveur de développement Django :

```bash
python manage.py runserver
```

L'API sera disponible sur `http://127.0.0.1:8000/` par défaut. La documentation OpenAPI/Swagger est exposée à `/api/schema/swagger-ui/`.

## Points d'intérêt (endpoints)

- POST `/api/auth/register/`
- POST `/api/auth/token/`
- POST `/api/auth/token/refresh/`
- GET `/api/profile/`
- GET `/api/enterprises/`
- GET `/api/products/`
- GET `/api/search/?q=...`
- GET `/api/favorites/`
- GET `/api/contact-requests/`
- GET `/api/conversations/`
- GET `/api/notifications/`

## Frontend

Le frontend se trouve dans le dossier `frontend/`. Consultez [frontend/README.md](frontend/README.md) pour les instructions de démarrage côté client.

## Déploiement rapide

- En production, configurez `DATABASE_URL` pour pointer vers une base PostgreSQL.
- Servez les fichiers statiques via un serveur capable de gérer `STATIC_ROOT` (collectstatic + CDN/reverse proxy).
- Pour le frontend, build (`npm run build`) et servir les fichiers compilés depuis un serveur statique ou CDN.

## Contribuer

- Ouvrez une issue pour discuter des changements importants.
- Faites une branche pour chaque fonctionnalité ou correctif et créez une pull request.

---
Ce fichier donne les informations essentielles pour démarrer le projet localement. Voir `frontend/README.md` pour les détails côté cliente.
