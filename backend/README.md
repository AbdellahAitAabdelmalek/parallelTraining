# Backend — Tests

Deux suites distinctes, toutes les deux à lancer depuis `backend/`.

## Tests unitaires

```bash
npm run test
```

## Tests E2E

Les tests E2E s'appuient sur une base de données PostgreSQL dédiée (port 5433).

**Prérequis — démarrer la base de test et appliquer les migrations :**

```bash
npm run db:test:up       # démarre le conteneur postgres_test via Docker Compose
npm run db:test:migrate  # applique les migrations sur la base de test
```

**Lancer les tests :**

```bash
npm run test:e2e
```

**Arrêter la base de test :**

```bash
npm run db:test:down
```

> Les guards JWT sont overridés en test — les valeurs `SUPABASE_*` dans `.env.test` sont factices et ne sont jamais appelées.