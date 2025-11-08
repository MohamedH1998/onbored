/*
  Warnings:

  - You are about to drop the column `funnelId` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `Funnel` table. All the data in the column will be lost.
  - You are about to drop the column `endedAt` on the `Funnel` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `Funnel` table. All the data in the column will be lost.
  - You are about to drop the column `onboredSessionId` on the `Funnel` table. All the data in the column will be lost.
  - You are about to drop the column `startedAt` on the `Funnel` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Funnel` table. All the data in the column will be lost.
  - You are about to drop the column `traits` on the `Funnel` table. All the data in the column will be lost.
  - You are about to drop the column `funnelId` on the `StepInsight` table. All the data in the column will be lost.
  - You are about to drop the `FunnelInsight` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FunnelPathInsight` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `createdById` to the `Funnel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Funnel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `flowId` to the `StepInsight` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FlowStatus" AS ENUM ('STARTED', 'COMPLETED', 'ABANDONED');

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_funnelId_fkey";

-- DropForeignKey
ALTER TABLE "Funnel" DROP CONSTRAINT "Funnel_onboredSessionId_fkey";

-- DropIndex
DROP INDEX "Event_funnelId_idx";

-- DropIndex
DROP INDEX "Funnel_name_idx";

-- DropIndex
DROP INDEX "Funnel_onboredSessionId_idx";

-- DropIndex
DROP INDEX "StepInsight_funnelId_stepName_idx";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "funnelId",
ADD COLUMN     "flowId" TEXT;

-- AlterTable
ALTER TABLE "Funnel" DROP COLUMN "duration",
DROP COLUMN "endedAt",
DROP COLUMN "metadata",
DROP COLUMN "onboredSessionId",
DROP COLUMN "startedAt",
DROP COLUMN "status",
DROP COLUMN "traits",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "StepInsight" DROP COLUMN "funnelId",
ADD COLUMN     "flowId" TEXT NOT NULL;

-- DropTable
DROP TABLE "FunnelInsight";

-- DropTable
DROP TABLE "FunnelPathInsight";

-- DropEnum
DROP TYPE "FunnelStatus";

-- CreateTable
CREATE TABLE "Flow" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "version" TEXT,
    "onboredSessionId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "status" "FlowStatus" NOT NULL DEFAULT 'STARTED',
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),
    "duration" INTEGER,
    "traits" JSONB,
    "metadata" JSONB,

    CONSTRAINT "Flow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlowInsight" (
    "id" TEXT NOT NULL,
    "flowId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "totalStarted" INTEGER NOT NULL,
    "totalCompleted" INTEGER NOT NULL,
    "avgCompletionTime" DOUBLE PRECISION NOT NULL,
    "completionRate" DOUBLE PRECISION NOT NULL,
    "trendSummary" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FlowInsight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlowPathInsight" (
    "id" TEXT NOT NULL,
    "flowId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "path" TEXT[],
    "userCount" INTEGER NOT NULL,
    "completionRate" DOUBLE PRECISION NOT NULL,
    "avgTime" DOUBLE PRECISION NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FlowPathInsight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FunnelStep" (
    "id" TEXT NOT NULL,
    "funnelId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "stepName" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FunnelStep_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Flow_projectId_idx" ON "Flow"("projectId");

-- CreateIndex
CREATE INDEX "Flow_onboredSessionId_idx" ON "Flow"("onboredSessionId");

-- CreateIndex
CREATE INDEX "Flow_name_idx" ON "Flow"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Flow_projectId_name_key" ON "Flow"("projectId", "name");

-- CreateIndex
CREATE INDEX "FlowInsight_flowId_idx" ON "FlowInsight"("flowId");

-- CreateIndex
CREATE INDEX "FlowPathInsight_flowId_idx" ON "FlowPathInsight"("flowId");

-- CreateIndex
CREATE INDEX "FunnelStep_funnelId_order_idx" ON "FunnelStep"("funnelId", "order");

-- CreateIndex
CREATE INDEX "Event_flowId_idx" ON "Event"("flowId");

-- CreateIndex
CREATE INDEX "Funnel_createdById_idx" ON "Funnel"("createdById");

-- CreateIndex
CREATE INDEX "StepInsight_flowId_stepName_idx" ON "StepInsight"("flowId", "stepName");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_flowId_fkey" FOREIGN KEY ("flowId") REFERENCES "Flow"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flow" ADD CONSTRAINT "Flow_onboredSessionId_fkey" FOREIGN KEY ("onboredSessionId") REFERENCES "OnboredSessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flow" ADD CONSTRAINT "Flow_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Funnel" ADD CONSTRAINT "Funnel_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "WorkspaceMember"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FunnelStep" ADD CONSTRAINT "FunnelStep_funnelId_fkey" FOREIGN KEY ("funnelId") REFERENCES "Funnel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
