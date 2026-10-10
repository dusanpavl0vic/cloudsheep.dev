-- CreateEnum
CREATE TYPE "ProjectCategory" AS ENUM ('frontend', 'backend', 'fullStack', 'openSource');

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" "ProjectCategory" NOT NULL,
    "year" INTEGER NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "titleSr" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "catSr" TEXT NOT NULL,
    "catEn" TEXT NOT NULL,
    "descSr" TEXT NOT NULL,
    "descEn" TEXT NOT NULL,
    "captionSr" TEXT NOT NULL DEFAULT '',
    "captionEn" TEXT NOT NULL DEFAULT '',
    "tech" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "liveUrl" TEXT,
    "repoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

-- CreateIndex
CREATE INDEX "Project_isPublished_sortOrder_idx" ON "Project"("isPublished", "sortOrder");
