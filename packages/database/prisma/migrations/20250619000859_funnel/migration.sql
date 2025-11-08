/*
  Warnings:

  - You are about to drop the column `flowId` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `flowId` on the `StepInsight` table. All the data in the column will be lost.
  - You are about to drop the `Flow` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FlowInsight` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FlowPathInsight` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `funnelId` to the `StepInsight` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FunnelStatus" AS ENUM ('STARTED', 'COMPLETED', 'ABANDONED');

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_flowId_fkey";

-- DropForeignKey
ALTER TABLE "Flow" DROP CONSTRAINT "Flow_onboredSessionId_fkey";

-- DropForeignKey
ALTER TABLE "Flow" DROP CONSTRAINT "Flow_projectId_fkey";

-- DropIndex
DROP INDEX "Event_flowId_idx";

-- DropIndex
DROP INDEX "StepInsight_flowId_stepName_idx";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "flowId",
ADD COLUMN     "funnelId" TEXT;

-- AlterTable
ALTER TABLE "StepInsight" DROP COLUMN "flowId",
ADD COLUMN     "funnelId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Flow";

-- DropTable
DROP TABLE "FlowInsight";

-- DropTable
DROP TABLE "FlowPathInsight";

-- DropEnum
DROP TYPE "FlowStatus";

-- CreateTable
CREATE TABLE "Funnel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "version" TEXT,
    "onboredSessionId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "status" "FunnelStatus" NOT NULL DEFAULT 'STARTED',
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),
    "duration" INTEGER,
    "traits" JSONB,
    "metadata" JSONB,

    CONSTRAINT "Funnel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FunnelInsight" (
    "id" TEXT NOT NULL,
    "funnelId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "totalStarted" INTEGER NOT NULL,
    "totalCompleted" INTEGER NOT NULL,
    "avgCompletionTime" DOUBLE PRECISION NOT NULL,
    "completionRate" DOUBLE PRECISION NOT NULL,
    "trendSummary" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FunnelInsight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FunnelPathInsight" (
    "id" TEXT NOT NULL,
    "funnelId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "path" TEXT[],
    "userCount" INTEGER NOT NULL,
    "completionRate" DOUBLE PRECISION NOT NULL,
    "avgTime" DOUBLE PRECISION NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FunnelPathInsight_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Funnel_projectId_idx" ON "Funnel"("projectId");

-- CreateIndex
CREATE INDEX "Funnel_onboredSessionId_idx" ON "Funnel"("onboredSessionId");

-- CreateIndex
CREATE INDEX "Funnel_name_idx" ON "Funnel"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Funnel_projectId_name_key" ON "Funnel"("projectId", "name");

-- CreateIndex
CREATE INDEX "FunnelInsight_funnelId_idx" ON "FunnelInsight"("funnelId");

-- CreateIndex
CREATE INDEX "FunnelPathInsight_funnelId_idx" ON "FunnelPathInsight"("funnelId");

-- CreateIndex
CREATE INDEX "Event_funnelId_idx" ON "Event"("funnelId");

-- CreateIndex
CREATE INDEX "StepInsight_funnelId_stepName_idx" ON "StepInsight"("funnelId", "stepName");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_funnelId_fkey" FOREIGN KEY ("funnelId") REFERENCES "Funnel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Funnel" ADD CONSTRAINT "Funnel_onboredSessionId_fkey" FOREIGN KEY ("onboredSessionId") REFERENCES "OnboredSessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Funnel" ADD CONSTRAINT "Funnel_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
