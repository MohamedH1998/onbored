-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "funnelId" TEXT;

-- CreateIndex
CREATE INDEX "Event_funnelId_idx" ON "Event"("funnelId");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_funnelId_fkey" FOREIGN KEY ("funnelId") REFERENCES "Funnel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
