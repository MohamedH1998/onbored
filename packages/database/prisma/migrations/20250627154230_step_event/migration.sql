/*
  Warnings:

  - You are about to drop the column `step` on the `Event` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Event_step_idx";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "step",
ADD COLUMN     "stepId" TEXT;

-- CreateIndex
CREATE INDEX "Event_stepId_idx" ON "Event"("stepId");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "FunnelStep"("id") ON DELETE SET NULL ON UPDATE CASCADE;
