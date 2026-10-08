-- CreateTable
CREATE TABLE "CvSiteProject" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "noteSr" TEXT NOT NULL DEFAULT '',
    "noteEn" TEXT NOT NULL DEFAULT '',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CvSiteProject_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CvSiteProject_memberId_sortOrder_idx" ON "CvSiteProject"("memberId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "CvSiteProject_memberId_projectId_key" ON "CvSiteProject"("memberId", "projectId");

-- AddForeignKey
ALTER TABLE "CvSiteProject" ADD CONSTRAINT "CvSiteProject_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "TeamMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CvSiteProject" ADD CONSTRAINT "CvSiteProject_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
