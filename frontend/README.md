# Frontend — React + TypeScript + Vite

This folder contains the client application built with React, TypeScript and Vite. The app communicates with the Django backend API (see project root).

## Tech

- React
- TypeScript
- Vite
- Tailwind CSS
- Axios + React Query

## Prérequis

- Node.js (v18+ recommended)
- npm or pnpm (examples below use `npm`)

## Installation

```bash
cd frontend
npm install
```

## Variables d'environnement

Le frontend lit `VITE_API_URL` pour construire l'URL de l'API. Un fichier `frontend/.env` est présent et définit par défaut :

```
VITE_API_URL=/api
```

Pendant le développement, laisser `/api` permet d'utiliser un proxy côté serveur (si configuré) ou d'appeler `http://localhost:8000/api` (le code contient un fallback). Pour pointer explicitement sur l'API Django en local, par exemple :

```
VITE_API_URL=http://localhost:8000/api
```

## Scripts utiles

- `npm run dev` — démarre le serveur de développement Vite (HMR)
- `npm run build` — compile l'application pour la production
- `npm run preview` — prévisualise le build localement
- `npm run lint` — lance ESLint

Exemples :

```bash
npm run dev
npm run build
npm run preview
```

## Développement

- L'application utilise `import.meta.env.VITE_API_URL` pour déterminer l'endpoint API. Configurez la variable si nécessaire.
- L'instance axios possède un mécanisme pour injecter le token JWT et rafraîchir les tokens automatiquement.

## Téléversement / Production

- Exécutez `npm run build` puis mettez le dossier `dist/` sur votre serveur statique ou CDN.

## Lint & Type-check

- `npm run lint` pour lancer ESLint.
- La compilation TypeScript est effectuée lors du build (`tsc -b`).

## Où regarder dans le code

- Points d'entrée : `src/main.tsx`, `src/App.tsx`
- API helper : `src/api/axiosInstance.ts`
- Routes : `src/router/`
- Pages : `src/pages/`

---
Pour plus d'informations sur la configuration Vite/React/ESLint, voir les fichiers de configuration présents dans ce dossier (`vite.config.ts`, `tsconfig.*.json`, `eslint.config.js`, `tailwind.config.js`).
