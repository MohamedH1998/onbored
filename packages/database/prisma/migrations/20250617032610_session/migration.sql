/*
  Warnings:

  - You are about to drop the column `sessionId` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `sessionId` on the `Flow` table. All the data in the column will be lost.
  - You are about to drop the column `externalId` on the `session` table. All the data in the column will be lost.
  - You are about to drop the column `lastSeenAt` on the `session` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `session` table. All the data in the column will be lost.
  - You are about to drop the column `startedAt` on the `session` table. All the data in the column will be lost.
  - Added the required column `userSessionId` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userSessionId` to the `Flow` table without a default value. This is not possible if the table is not empty.
  - Made the column `userId` on table `session` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "Flow" DROP CONSTRAINT "Flow_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "session" DROP CONSTRAINT "session_projectId_fkey";

-- DropForeignKey
ALTER TABLE "session" DROP CONSTRAINT "session_userId_fkey";

-- DropIndex
DROP INDEX "Event_sessionId_idx";

-- DropIndex
DROP INDEX "Flow_sessionId_idx";

-- DropIndex
DROP INDEX "session_externalId_key";

-- DropIndex
DROP INDEX "session_lastSeenAt_idx";

-- DropIndex
DROP INDEX "session_projectId_idx";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "sessionId",
ADD COLUMN     "userSessionId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Flow" DROP COLUMN "sessionId",
ADD COLUMN     "userSessionId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "session" DROP COLUMN "externalId",
DROP COLUMN "lastSeenAt",
DROP COLUMN "projectId",
DROP COLUMN "startedAt",
ALTER COLUMN "userId" SET NOT NULL;

-- CreateTable
CREATE TABLE "UserSession" (
    "id" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "userId" TEXT,
    "projectId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSession_externalId_key" ON "UserSession"("externalId");

-- CreateIndex
CREATE INDEX "UserSession_projectId_idx" ON "UserSession"("projectId");

-- CreateIndex
CREATE INDEX "UserSession_lastSeenAt_idx" ON "UserSession"("lastSeenAt");

-- CreateIndex
CREATE INDEX "Event_userSessionId_idx" ON "Event"("userSessionId");

-- CreateIndex
CREATE INDEX "Flow_userSessionId_idx" ON "Flow"("userSessionId");

-- AddForeignKey
ALTER TABLE "UserSession" ADD CONSTRAINT "UserSession_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_userSessionId_fkey" FOREIGN KEY ("userSessionId") REFERENCES "UserSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flow" ADD CONSTRAINT "Flow_userSessionId_fkey" FOREIGN KEY ("userSessionId") REFERENCES "UserSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
