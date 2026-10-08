/*
  Warnings:

  - You are about to drop the `CvProject` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CvProject" DROP CONSTRAINT "CvProject_memberId_fkey";

-- DropTable
DROP TABLE "CvProject";
