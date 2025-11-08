/*
  Warnings:

  - You are about to drop the column `name` on the `Flow` table. All the data in the column will be lost.
  - You are about to drop the column `version` on the `Flow` table. All the data in the column will be lost.
  - You are about to drop the column `flowId` on the `FlowInsight` table. All the data in the column will be lost.
  - You are about to drop the column `flowId` on the `FlowPathInsight` table. All the data in the column will be lost.
  - You are about to drop the column `flowId` on the `StepInsight` table. All the data in the column will be lost.
  - Added the required column `funnelId` to the `FlowInsight` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Flow_name_idx";

-- DropIndex
DROP INDEX "Flow_projectId_name_key";

-- DropIndex
DROP INDEX "FlowInsight_flowId_idx";

-- DropIndex
DROP INDEX "FlowPathInsight_flowId_idx";

-- DropIndex
DROP INDEX "Funnel_createdById_idx";

-- DropIndex
DROP INDEX "StepInsight_flowId_stepName_idx";

-- AlterTable
ALTER TABLE "Flow" DROP COLUMN "name",
DROP COLUMN "version";

-- AlterTable
ALTER TABLE "FlowInsight" DROP COLUMN "flowId",
ADD COLUMN     "funnelId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "FlowPathInsight" DROP COLUMN "flowId",
ADD COLUMN     "funnelId" TEXT;

-- AlterTable
ALTER TABLE "StepInsight" DROP COLUMN "flowId",
ADD COLUMN     "funnelId" TEXT;

-- CreateIndex
CREATE INDEX "FlowInsight_funnelId_idx" ON "FlowInsight"("funnelId");

-- CreateIndex
CREATE INDEX "FlowPathInsight_projectId_idx" ON "FlowPathInsight"("projectId");

-- CreateIndex
CREATE INDEX "StepInsight_projectId_stepName_idx" ON "StepInsight"("projectId", "stepName");

-- AddForeignKey
ALTER TABLE "StepInsight" ADD CONSTRAINT "StepInsight_funnelId_fkey" FOREIGN KEY ("funnelId") REFERENCES "Funnel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StepInsight" ADD CONSTRAINT "StepInsight_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlowInsight" ADD CONSTRAINT "FlowInsight_funnelId_fkey" FOREIGN KEY ("funnelId") REFERENCES "Funnel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlowInsight" ADD CONSTRAINT "FlowInsight_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlowPathInsight" ADD CONSTRAINT "FlowPathInsight_funnelId_fkey" FOREIGN KEY ("funnelId") REFERENCES "Funnel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlowPathInsight" ADD CONSTRAINT "FlowPathInsight_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
