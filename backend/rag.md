# Documentation RAG — ParallelTraining

## Vue d'ensemble

Le système RAG (Retrieval Augmented Generation) est conçu pour suggérer des codes CIM-10 (Classification Internationale des Maladies) à partir d'une description clinique saisie par l'utilisateur. Il s'appuie sur l'indexation d'un document de référence médicale (CoCoA) et utilise un LLM pour générer des suggestions justifiées.

---

## Flux de données de bout en bout

```
1. SAISIE UTILISATEUR (Frontend)
        ↓
2. EMBEDDING (OpenAI text-embedding-3-small)
        ↓
3. RECHERCHE VECTORIELLE (PostgreSQL + pgvector, similarité cosinus)
        ↓
4. RÉCUPÉRATION DU CONTEXTE (Top 5 entrées les plus similaires)
        ↓
5. CONSTRUCTION DU PROMPT (contexte médical + saisie utilisateur)
        ↓
6. COMPLÉTION LLM (GPT-4o, réponse JSON structurée)
        ↓
7. PARSING DE LA RÉPONSE (extraction des suggestions)
        ↓
8. AFFICHAGE FRONTEND (codes + justifications + règles de codage)
```

---

## Composants du pipeline

### 1. Ingestion des données

**Fichier** : `backend/src/features/cim10/use-cases/ingest-document.use-case.ts`

- **Source** : document PDF `CoCoA.pdf` (guide officiel de codage CIM-10)
- **Stratégie de chunking** :
  - Découpage sur les patterns de codes CIM-10 via regex : `^[A-Z]\d{2}(?:\.\d+)?`
  - Longueur minimale de chunk : 10 caractères
  - Chaque chunk = code + libellé + contenu descriptif complet
- **Rate limiting** : délai de 700ms entre les appels API pour rester sous la limite de 100 RPM d'OpenAI
- **Sécurité** : seuil de 1000 entrées pour éviter les doublons lors des redémarrages

### 2. Génération des embeddings

**Fichier** : `backend/src/infrastructure/openai/openai-embedding.service.ts`

- **Modèle** : `text-embedding-3-small` (OpenAI)
- **Dimensions** : 1536
- **Troncature** : 16 000 caractères maximum en entrée (~5 300 tokens)

### 3. Stockage vectoriel

**Fichier** : `backend/src/infrastructure/db/schemas/cim10-entry-schema.ts`

Schéma PostgreSQL :

```sql
CREATE TABLE "cim10_entries" (
  "id"         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "content"    text NOT NULL,        -- Texte médical complet
  "metadata"   jsonb NOT NULL,       -- { code, libelle }
  "embedding"  vector(1536),         -- Vecteur OpenAI
  "created_at" timestamp DEFAULT now()
);
```

Extension PostgreSQL requise : **pgvector**

### 4. Recherche par similarité

**Fichier** : `backend/src/infrastructure/db/drizzle-cim10-entry.repository.ts`

- **Métrique** : similarité cosinus via l'opérateur pgvector `<=>`
- **Résultats retournés** : Top 5 entrées les plus proches

```sql
SELECT * FROM cim10_entries
ORDER BY embedding <=> $query_vector::vector
LIMIT 5;
```

### 5. Génération des suggestions (LLM)

**Fichier** : `backend/src/features/cim10/use-cases/suggest-codes.use-case.ts`

- **Modèle** : `gpt-4o`
- **Format de réponse** : JSON structuré enforced
- **Prompt** : expert en codage médical CIM-10 francophone, basé uniquement sur les extraits CoCoA récupérés
- **Structure de réponse par suggestion** :
  - `code` : code CIM-10
  - `libelle` : intitulé du code
  - `justification` : explication basée sur les extraits
  - `regles_codage` : règles spécifiques issues du CoCoA
