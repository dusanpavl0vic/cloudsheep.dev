-- CreateTable
CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "roleSr" TEXT NOT NULL DEFAULT '',
    "roleEn" TEXT NOT NULL DEFAULT '',
    "avatarId" TEXT,
    "hasDiploma" BOOLEAN NOT NULL DEFAULT false,
    "universitySr" TEXT NOT NULL DEFAULT '',
    "universityEn" TEXT NOT NULL DEFAULT '',
    "degreeSr" TEXT NOT NULL DEFAULT '',
    "degreeEn" TEXT NOT NULL DEFAULT '',
    "programmeSr" TEXT NOT NULL DEFAULT '',
    "programmeEn" TEXT NOT NULL DEFAULT '',
    "facultySr" TEXT NOT NULL DEFAULT '',
    "facultyEn" TEXT NOT NULL DEFAULT '',
    "city" TEXT NOT NULL DEFAULT '',
    "sealId" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TeamMember_isVisible_sortOrder_idx" ON "TeamMember"("isVisible", "sortOrder");

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_sealId_fkey" FOREIGN KEY ("sealId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;
