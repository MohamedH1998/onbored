/*
  Warnings:

  - You are about to drop the column `userSessionId` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `userSessionId` on the `Flow` table. All the data in the column will be lost.
  - You are about to drop the `UserSession` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `onboredSessionId` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `onboredSessionId` to the `Flow` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_userSessionId_fkey";

-- DropForeignKey
ALTER TABLE "Flow" DROP CONSTRAINT "Flow_userSessionId_fkey";

-- DropForeignKey
ALTER TABLE "UserSession" DROP CONSTRAINT "UserSession_projectId_fkey";

-- DropIndex
DROP INDEX "Event_userSessionId_idx";

-- DropIndex
DROP INDEX "Flow_userSessionId_idx";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "userSessionId",
ADD COLUMN     "onboredSessionId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Flow" DROP COLUMN "userSessionId",
ADD COLUMN     "onboredSessionId" TEXT NOT NULL;

-- DropTable
DROP TABLE "UserSession";

-- CreateTable
CREATE TABLE "OnboredSessions" (
    "id" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "userId" TEXT,
    "projectId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OnboredSessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OnboredSessions_externalId_key" ON "OnboredSessions"("externalId");

-- CreateIndex
CREATE INDEX "OnboredSessions_projectId_idx" ON "OnboredSessions"("projectId");

-- CreateIndex
CREATE INDEX "OnboredSessions_lastSeenAt_idx" ON "OnboredSessions"("lastSeenAt");

-- CreateIndex
CREATE INDEX "Event_onboredSessionId_idx" ON "Event"("onboredSessionId");

-- CreateIndex
CREATE INDEX "Flow_onboredSessionId_idx" ON "Flow"("onboredSessionId");

-- AddForeignKey
ALTER TABLE "OnboredSessions" ADD CONSTRAINT "OnboredSessions_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_onboredSessionId_fkey" FOREIGN KEY ("onboredSessionId") REFERENCES "OnboredSessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flow" ADD CONSTRAINT "Flow_onboredSessionId_fkey" FOREIGN KEY ("onboredSessionId") REFERENCES "OnboredSessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
