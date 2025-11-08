-- AlterTable
ALTER TABLE "SessionInsight" ADD COLUMN     "flowId" TEXT;

-- CreateIndex
CREATE INDEX "SessionInsight_flowId_idx" ON "SessionInsight"("flowId");

-- AddForeignKey
ALTER TABLE "SessionInsight" ADD CONSTRAINT "SessionInsight_flowId_fkey" FOREIGN KEY ("flowId") REFERENCES "Flow"("id") ON DELETE SET NULL ON UPDATE CASCADE;
