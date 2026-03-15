# Parallel CIM-10 — Suggestion de codes médicaux

## Objectif

Ce projet implémente un système de **Retrieval-Augmented Generation (RAG)** pour suggérer des codes médicaux **CIM-10** (Classification Internationale des Maladies, 10e révision) à a partir d'une description clinique en langage naturel.

Le document de référence utilisé est le **CoCoA** (Compendium de Codage), un guide officiel d'aide au codage diagnostique.

### Fonctionnement cible

1. Le document CoCoA (PDF) est découpé en extraits (_cim10Entries_) et indexé dans une base vectorielle.
2. Chaque Cim10Entry est transformé en vecteur numérique via l'API OpenAI (modèle `text-embedding-3-small`).
3. Lorsqu'un utilisateur décrit un symptôme ou un diagnostic, sa description est également vectorisée.
4. Les cim10Entries les plus proches sémantiquement sont récupérés via une recherche de similarité cosinus (pgvector).
5. Les codes CIM-10 associés à ces cim10Entries sont retournés comme suggestions.

## Stack technique

| Couche          | Technologie                                            |
| --------------- | ------------------------------------------------------ |
| Backend         | NestJS (TypeScript) — architecture hexagonale          |
| Frontend        | React + Tailwind CSS (Vite)                            |
| Base de données | PostgreSQL + extension pgvector                        |
| ORM             | Drizzle ORM + drizzle-kit                              |
| Embeddings      | OpenAI API (`text-embedding-3-small`, 1536 dimensions) |
| Infrastructure  | Docker Compose                                         |

## Démarrage rapide

### Prérequis

- Docker + Docker Compose
- Node.js 20+
- Une clé API OpenAI

### Installation

```bash
# 1. Variables d'environnement
cp backend/.env.example backend/.env

# 2. Base de données
cd backend
docker compose up -d
npm install
npm run db:migrate

# 3. Backend
npm run start:dev

# 4. Frontend (dans un autre terminal)
cd ../frontend
npm install
npm run dev
```

L'API est disponible sur `http://localhost:3000`, le frontend sur `http://localhost:5173`.

## Structure du projet

```
parallelTraining/
├── docker/initdb/          ← scripts SQL d'initialisation PostgreSQL
├── backend/                ← API NestJS (voir ARCHITECTURE.md)
├── frontend/               ← Interface React
├── CoCoA.pdf               ← document source à indexer
├── docker-compose.yml
└── .env.example
```

## Tests

Voir [backend/README.md](backend/README.md).

## Endpoints

| Méthode | Route                   | Description                                         |
| ------- | ----------------------- | --------------------------------------------------- |
| POST    | `/codage-cim10/ingest`  | Indexe le document CoCoA                            |
| POST    | `/codage-cim10/suggest` | Retourne des suggestions CIM-10 pour un texte donné |
