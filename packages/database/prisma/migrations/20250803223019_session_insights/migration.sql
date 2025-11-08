/*
  Warnings:

  - You are about to drop the column `sessionReplayId` on the `SessionInsight` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "SessionInsight" DROP CONSTRAINT "SessionInsight_sessionReplayId_fkey";

-- AlterTable
ALTER TABLE "SessionInsight" DROP COLUMN "sessionReplayId";
