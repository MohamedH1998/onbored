-- AlterTable
ALTER TABLE "Flow" ADD COLUMN     "funnelId" TEXT;

-- CreateIndex
CREATE INDEX "Flow_funnelId_idx" ON "Flow"("funnelId");

-- AddForeignKey
ALTER TABLE "Flow" ADD CONSTRAINT "Flow_funnelId_fkey" FOREIGN KEY ("funnelId") REFERENCES "Funnel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
