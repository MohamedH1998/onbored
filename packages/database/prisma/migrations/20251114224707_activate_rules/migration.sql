-- CreateTable
CREATE TABLE "ActivationRule" (
    "id" TEXT NOT NULL,
    "funnelId" TEXT,
    "projectId" TEXT,
    "stepName" TEXT,
    "eventName" TEXT,
    "userProfile" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ActivationRule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ActivationRule_funnelId_idx" ON "ActivationRule"("funnelId");

-- CreateIndex
CREATE INDEX "ActivationRule_projectId_idx" ON "ActivationRule"("projectId");

-- CreateIndex
CREATE INDEX "ActivationRule_userProfile_idx" ON "ActivationRule"("userProfile");

-- AddForeignKey
ALTER TABLE "ActivationRule" ADD CONSTRAINT "ActivationRule_funnelId_fkey" FOREIGN KEY ("funnelId") REFERENCES "Funnel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivationRule" ADD CONSTRAINT "ActivationRule_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
