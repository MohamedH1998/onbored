-- AlterTable
ALTER TABLE "SessionInsight" ADD COLUMN     "actionableRecommendation" TEXT,
ADD COLUMN     "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0.8,
ADD COLUMN     "funnelStep" TEXT,
ADD COLUMN     "severity" TEXT,
ADD COLUMN     "signals" TEXT[],
ADD COLUMN     "userBehaviorSummary" TEXT;

-- CreateIndex
CREATE INDEX "SessionInsight_funnelStep_idx" ON "SessionInsight"("funnelStep");

-- CreateIndex
CREATE INDEX "SessionInsight_severity_idx" ON "SessionInsight"("severity");
