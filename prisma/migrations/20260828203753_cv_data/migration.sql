-- AlterTable
ALTER TABLE "TeamMember" ADD COLUMN     "educationEndYear" INTEGER,
ADD COLUMN     "educationStartYear" INTEGER,
ADD COLUMN     "educationStatusEn" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "educationStatusSr" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "email" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "githubUrl" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "gpa" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "linkedinUrl" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "locationEn" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "locationSr" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "phone" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "summaryEn" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "summarySr" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "websiteUrl" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "CvExperience" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "positionSr" TEXT NOT NULL DEFAULT '',
    "positionEn" TEXT NOT NULL DEFAULT '',
    "locationSr" TEXT NOT NULL DEFAULT '',
    "locationEn" TEXT NOT NULL DEFAULT '',
    "startYear" INTEGER NOT NULL,
    "startMonth" INTEGER,
    "endYear" INTEGER,
    "endMonth" INTEGER,
    "summarySr" TEXT NOT NULL DEFAULT '',
    "summaryEn" TEXT NOT NULL DEFAULT '',
    "bulletsSr" TEXT[],
    "bulletsEn" TEXT[],
    "technologies" TEXT[],
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CvExperience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CvProject" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "summarySr" TEXT NOT NULL DEFAULT '',
    "summaryEn" TEXT NOT NULL DEFAULT '',
    "bulletsSr" TEXT[],
    "bulletsEn" TEXT[],
    "technologies" TEXT[],
    "noteSr" TEXT NOT NULL DEFAULT '',
    "noteEn" TEXT NOT NULL DEFAULT '',
    "year" INTEGER,
    "repoUrl" TEXT NOT NULL DEFAULT '',
    "liveUrl" TEXT NOT NULL DEFAULT '',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CvProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CvSkill" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "groupSr" TEXT NOT NULL DEFAULT '',
    "groupEn" TEXT NOT NULL DEFAULT '',
    "years" DECIMAL(3,1),
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CvSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CvLanguage" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "nameSr" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "levelSr" TEXT NOT NULL DEFAULT '',
    "levelEn" TEXT NOT NULL DEFAULT '',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CvLanguage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CvExperience_memberId_sortOrder_idx" ON "CvExperience"("memberId", "sortOrder");

-- CreateIndex
CREATE INDEX "CvProject_memberId_sortOrder_idx" ON "CvProject"("memberId", "sortOrder");

-- CreateIndex
CREATE INDEX "CvSkill_memberId_sortOrder_idx" ON "CvSkill"("memberId", "sortOrder");

-- CreateIndex
CREATE INDEX "CvLanguage_memberId_sortOrder_idx" ON "CvLanguage"("memberId", "sortOrder");

-- AddForeignKey
ALTER TABLE "CvExperience" ADD CONSTRAINT "CvExperience_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "TeamMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CvProject" ADD CONSTRAINT "CvProject_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "TeamMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CvSkill" ADD CONSTRAINT "CvSkill_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "TeamMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CvLanguage" ADD CONSTRAINT "CvLanguage_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "TeamMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;
