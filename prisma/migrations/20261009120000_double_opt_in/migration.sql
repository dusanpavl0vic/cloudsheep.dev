-- AlterTable
ALTER TABLE "ContactMessage" ADD COLUMN     "confirmTokenHash" TEXT,
ADD COLUMN     "confirmedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "NewsletterSubscriber" ADD COLUMN     "confirmTokenHash" TEXT,
ADD COLUMN     "confirmedAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "ContactMessage_confirmTokenHash_key" ON "ContactMessage"("confirmTokenHash");

-- CreateIndex
CREATE UNIQUE INDEX "NewsletterSubscriber_confirmTokenHash_key" ON "NewsletterSubscriber"("confirmTokenHash");


-- Poruke i prijave iz vremena pre potvrde linkom (ADR 0016) računaju se kao potvrđene:
-- stari sajt nije imao ovaj korak, a ti upiti su već stigli studiju.
UPDATE "ContactMessage" SET "confirmedAt" = "createdAt" WHERE "confirmedAt" IS NULL;
UPDATE "NewsletterSubscriber" SET "confirmedAt" = "createdAt" WHERE "confirmedAt" IS NULL;
