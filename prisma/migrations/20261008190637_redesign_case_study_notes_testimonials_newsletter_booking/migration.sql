-- CreateEnum
CREATE TYPE "DeviceKind" AS ENUM ('phone', 'browser');

-- AlterTable
ALTER TABLE "ContactMessage" ADD COLUMN     "budget" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "estimate" JSONB,
ADD COLUMN     "locale" TEXT NOT NULL DEFAULT 'en',
ADD COLUMN     "projectType" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "timeline" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "chapters" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "client" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "growth" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
ADD COLUMN     "metrics" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "roleEn" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "roleSr" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "timelineEn" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "timelineSr" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "ProjectImage" ADD COLUMN     "device" "DeviceKind";

-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "titleSr" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "excerptSr" TEXT NOT NULL DEFAULT '',
    "excerptEn" TEXT NOT NULL DEFAULT '',
    "bodySr" TEXT NOT NULL,
    "bodyEn" TEXT NOT NULL,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "coverId" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL,
    "quoteSr" TEXT NOT NULL,
    "quoteEn" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "authorRoleSr" TEXT NOT NULL DEFAULT '',
    "authorRoleEn" TEXT NOT NULL DEFAULT '',
    "company" TEXT NOT NULL DEFAULT '',
    "avatarId" TEXT,
    "projectId" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsletterSubscriber" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "unsubscribeToken" TEXT NOT NULL,
    "unsubscribedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NewsletterSubscriber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingSlot" (
    "id" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "durationMin" INTEGER NOT NULL DEFAULT 30,
    "contactMessageId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BookingSlot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Note_slug_key" ON "Note"("slug");

-- CreateIndex
CREATE INDEX "Note_isPublished_publishedAt_idx" ON "Note"("isPublished", "publishedAt");

-- CreateIndex
CREATE INDEX "Testimonial_isPublished_sortOrder_idx" ON "Testimonial"("isPublished", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "NewsletterSubscriber_email_key" ON "NewsletterSubscriber"("email");

-- CreateIndex
CREATE UNIQUE INDEX "NewsletterSubscriber_unsubscribeToken_key" ON "NewsletterSubscriber"("unsubscribeToken");

-- CreateIndex
CREATE UNIQUE INDEX "BookingSlot_startsAt_key" ON "BookingSlot"("startsAt");

-- CreateIndex
CREATE UNIQUE INDEX "BookingSlot_contactMessageId_key" ON "BookingSlot"("contactMessageId");

-- CreateIndex
CREATE INDEX "BookingSlot_startsAt_idx" ON "BookingSlot"("startsAt");

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_coverId_fkey" FOREIGN KEY ("coverId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Testimonial" ADD CONSTRAINT "Testimonial_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Testimonial" ADD CONSTRAINT "Testimonial_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingSlot" ADD CONSTRAINT "BookingSlot_contactMessageId_fkey" FOREIGN KEY ("contactMessageId") REFERENCES "ContactMessage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
