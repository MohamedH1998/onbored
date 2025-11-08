/*
  Warnings:

  - You are about to drop the `Event` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Flow` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OnboredSessions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_flowId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_funnelId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_onboredSessionId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_stepId_fkey";

-- DropForeignKey
ALTER TABLE "Flow" DROP CONSTRAINT "Flow_funnelId_fkey";

-- DropForeignKey
ALTER TABLE "Flow" DROP CONSTRAINT "Flow_onboredSessionId_fkey";

-- DropForeignKey
ALTER TABLE "Flow" DROP CONSTRAINT "Flow_projectId_fkey";

-- DropForeignKey
ALTER TABLE "OnboredSessions" DROP CONSTRAINT "OnboredSessions_projectId_fkey";

-- DropForeignKey
ALTER TABLE "SessionInsight" DROP CONSTRAINT "SessionInsight_flowId_fkey";

-- DropForeignKey
ALTER TABLE "SessionInsight" DROP CONSTRAINT "SessionInsight_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "SessionReplay" DROP CONSTRAINT "SessionReplay_onboredSessionId_fkey";

-- DropTable
DROP TABLE "Event";

-- DropTable
DROP TABLE "Flow";

-- DropTable
DROP TABLE "OnboredSessions";

-- DropEnum
DROP TYPE "FlowStatus";
