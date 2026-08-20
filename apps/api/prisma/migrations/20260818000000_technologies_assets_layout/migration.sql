-- Tehnologije prelaze iz `Project.tech` (text[]) u zasebnu tabelu sa vezom.
--
-- Migracija NIJE samo promena šeme: kolona `tech` nosi podatke pet postojećih projekata.
-- Prisma bi je prosto obrisala, pa se prenos radi ovde, između kreiranja tabela i brisanja
-- kolone. Bez ovoga bi svaki projekat posle deploya ostao bez ijedne tehnologije.

-- CreateEnum
CREATE TYPE "MediaSide" AS ENUM ('start', 'end');

-- CreateEnum
CREATE TYPE "GalleryLayout" AS ENUM ('grid', 'feature', 'none');

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "galleryLayout" "GalleryLayout" NOT NULL DEFAULT 'grid',
ADD COLUMN     "mediaSide" "MediaSide" NOT NULL DEFAULT 'start';

-- CreateTable
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectImage" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "altSr" TEXT NOT NULL DEFAULT '',
    "altEn" TEXT NOT NULL DEFAULT '',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProjectImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Technology" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "group" TEXT NOT NULL DEFAULT 'tooling',
    "logoId" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Technology_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectTechnology" (
    "projectId" TEXT NOT NULL,
    "technologyId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProjectTechnology_pkey" PRIMARY KEY ("projectId","technologyId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Asset_storageKey_key" ON "Asset"("storageKey");

-- CreateIndex
CREATE INDEX "ProjectImage_projectId_sortOrder_idx" ON "ProjectImage"("projectId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Technology_slug_key" ON "Technology"("slug");

-- CreateIndex
CREATE INDEX "ProjectTechnology_projectId_sortOrder_idx" ON "ProjectTechnology"("projectId", "sortOrder");

-- AddForeignKey
ALTER TABLE "ProjectImage" ADD CONSTRAINT "ProjectImage_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectImage" ADD CONSTRAINT "ProjectImage_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Technology" ADD CONSTRAINT "Technology_logoId_fkey" FOREIGN KEY ("logoId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTechnology" ADD CONSTRAINT "ProjectTechnology_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTechnology" ADD CONSTRAINT "ProjectTechnology_technologyId_fkey" FOREIGN KEY ("technologyId") REFERENCES "Technology"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- ── Prenos podataka: `Project.tech` → `Technology` + `ProjectTechnology` ────────────

-- Slug se izvodi iz naziva istom normalizacijom koju je koristio `techIconFor` na
-- frontendu (mala slova, bez razmaka, tačaka i crtica) — tako se `Node.js` i `nodejs`
-- prepoznaju kao ista tehnologija, i tako se poklapaju sa imenima postojećih SVG fajlova.
INSERT INTO "Technology" ("id", "slug", "label", "group", "sortOrder", "createdAt")
SELECT
  gen_random_uuid(),
  lower(regexp_replace(t, '[^a-zA-Z0-9]', '', 'g')),
  t,
  'tooling',
  0,
  CURRENT_TIMESTAMP
FROM (SELECT DISTINCT unnest("tech") AS t FROM "Project") AS distinct_tech
ON CONFLICT ("slug") DO NOTHING;

-- `WITH ORDINALITY` čuva redosled kojim su tehnologije bile navedene u nizu.
INSERT INTO "ProjectTechnology" ("projectId", "technologyId", "sortOrder")
SELECT p."id", tech."id", ord."n" - 1
FROM "Project" p
CROSS JOIN LATERAL unnest(p."tech") WITH ORDINALITY AS ord("val", "n")
JOIN "Technology" tech
  ON tech."slug" = lower(regexp_replace(ord."val", '[^a-zA-Z0-9]', '', 'g'))
ON CONFLICT DO NOTHING;

-- Tek sada, kad su podaci na sigurnom.
ALTER TABLE "Project" DROP COLUMN "tech";
