# Architecture du backend

Le backend suit les principes de l'**architecture hexagonale** (Ports & Adapters), qui isole la logique métier des détails techniques (base de données, API externes, framework HTTP).

## Principe

```
  [ HTTP / NestJS ]
         ↓
  [ Use Cases ]  ←→  Ports (interfaces)  ←→  [ Adapters ]
         ↓                                      ↙      ↘
  [ Entities ]                          [ Drizzle ]  [ OpenAI ]
```

Le **domaine** (entités + ports) ne dépend de rien d'externe.
Les **adapters** (infrastructure) implémentent les ports.
Les **use cases** (application) orchestrent la logique via les ports.

---

## Structure des dossiers

```
src/
├── domain/                         ← cœur métier, aucune dépendance externe
│   ├── entities/                   ← objets métier (ex. Chunk)
│   └── ports/                      ← interfaces de persistance et services
│
├── application/                    ← cas d'usage, orchestre le domaine
│   └── use-cases/
│       ├── ingest-document.use-case.ts  ← indexer le PDF CoCoA
│       └── suggest-codes.use-case.ts    ← suggérer des codes CIM-10
│
├── infrastructure/                 ← adapters techniques
│   ├── db/                         ← Drizzle ORM + PostgreSQL
│   └── openai/                     ← appels à l'API OpenAI
│
├── presentation/
│   └── http/
│       ├── rag.controller.ts       ← routes REST
│       └── rag.module.ts           ← wiring NestJS (DI)
│
└── migrations/                     ← fichiers SQL générés par drizzle-kit
```