-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "fullName" TEXT NOT NULL,
    "location" TEXT NOT NULL DEFAULT '',
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "headlineSr" TEXT NOT NULL DEFAULT '',
    "headlineEn" TEXT NOT NULL DEFAULT '',
    "bioSr" TEXT NOT NULL DEFAULT '',
    "bioEn" TEXT NOT NULL DEFAULT '',
    "universitySr" TEXT NOT NULL DEFAULT '',
    "universityEn" TEXT NOT NULL DEFAULT '',
    "degreeSr" TEXT NOT NULL DEFAULT '',
    "degreeEn" TEXT NOT NULL DEFAULT '',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialLink" (
    "id" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "SocialLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SocialLink_isVisible_sortOrder_idx" ON "SocialLink"("isVisible", "sortOrder");
