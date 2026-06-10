DELETE FROM "embeddings";

ALTER TABLE "embeddings"
ALTER COLUMN "vector" TYPE vector(3072);

UPDATE "documents" d
SET "status" = 'PENDING',
    "indexedAt" = NULL,
    "errorMessage" = NULL
WHERE EXISTS (
  SELECT 1
  FROM "chunks" c
  WHERE c."documentId" = d."id"
);
