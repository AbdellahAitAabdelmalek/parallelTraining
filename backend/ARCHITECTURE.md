# Architecture du backend

Le backend suit une approche **hybride** entre l'architecture hexagonale (Ports & Adapters) et un découpage **feature-first** : le cœur métier (entités + ports + use cases) est organisé par feature, tandis que l'infrastructure et la présentation restent des couches horizontales indépendantes.

## Principe

```
  [ presentation/http ]        ← livraison HTTP (controllers, guards, contracts)
          ↓
  [ features/*/use-cases ]     ← logique métier, orchestration
          ↓
  [ features/*/ports ]         ← interfaces (contrats abstraits)
          ↑
  [ infrastructure/ ]          ← implémentations concrètes (DB, OpenAI, Auth)
```

Le **domaine** (entités + ports + use cases) ne dépend de rien d'externe.
L'**infrastructure** implémente les ports — on peut changer d'ORM sans toucher aux features.
La **présentation** ne connaît que les use cases et les guards.

---

## Structure des dossiers

```
src/
├── features/
│   └── user/                        ← exemple de feature (même structure pour cim10, etc.)
│       ├── entities/                ← objets métier purs
│       ├── ports/                   ← interfaces (contrats abstraits)
│       └── use-cases/               ← logique métier, orchestration
│
├── infrastructure/                  ← adapters techniques (détails d'implémentation)
│   ├── auth/                        ← JWT, guards
│   ├── db/                          ← Drizzle ORM + PostgreSQL
│   └── openai/                      ← appels à l'API OpenAI
│
├── presentation/
│   └── http/                        ← controllers, modules NestJS, contrats HTTP (TsRest)
│
└── migrations/                      ← fichiers SQL générés par drizzle-kit
```

---

## Pourquoi ce découpage ?

- **Ajouter une feature** → créer un dossier `features/nouvelle-feature/` autonome
- **Changer d'ORM** → modifier uniquement `infrastructure/db/`, sans toucher aux features
- **Changer de framework HTTP** → modifier uniquement `presentation/`, sans toucher aux features
