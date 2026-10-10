/*
  Warnings:

  - You are about to drop the `CvSkill` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CvSkill" DROP CONSTRAINT "CvSkill_memberId_fkey";

-- DropTable
DROP TABLE "CvSkill";
