ALTER TABLE "documents"
ADD COLUMN "markdown" TEXT,
ADD COLUMN "errorMessage" TEXT,
ADD COLUMN "indexedAt" TIMESTAMP(3);

ALTER TABLE "chunks"
ADD COLUMN "section" TEXT,
ADD COLUMN "startOffset" INTEGER,
ADD COLUMN "endOffset" INTEGER;

CREATE EXTENSION IF NOT EXISTS vector;

CREATE INDEX IF NOT EXISTS "embeddings_vector_idx"
ON "embeddings"
USING hnsw ("vector" vector_cosine_ops);
