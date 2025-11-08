/*
  Warnings:

  - You are about to drop the column `sessionId` on the `SessionReplay` table. All the data in the column will be lost.
  - Added the required column `onboredSessionId` to the `SessionReplay` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "SessionReplay_projectId_sessionId_idx";

-- AlterTable
ALTER TABLE "SessionReplay" DROP COLUMN "sessionId",
ADD COLUMN     "onboredSessionId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "SessionReplay_projectId_onboredSessionId_idx" ON "SessionReplay"("projectId", "onboredSessionId");

-- AddForeignKey
ALTER TABLE "SessionReplay" ADD CONSTRAINT "SessionReplay_onboredSessionId_fkey" FOREIGN KEY ("onboredSessionId") REFERENCES "OnboredSessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
