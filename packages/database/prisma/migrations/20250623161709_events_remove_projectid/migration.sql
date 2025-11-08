/*
  Warnings:

  - You are about to drop the column `projectId` on the `Event` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_projectId_fkey";

-- DropIndex
DROP INDEX "Event_projectId_idx";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "projectId";
