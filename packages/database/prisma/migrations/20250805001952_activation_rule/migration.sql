-- CreateEnum
CREATE TYPE "ActivationType" AS ENUM ('STEP', 'EVENT', 'COMPOSITE');

-- CreateTable
CREATE TABLE "ActivationRule" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ActivationType" NOT NULL,
    "funnelId" TEXT NOT NULL,
    "stepName" TEXT,
    "eventName" TEXT,
    "conditions" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivationRule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ActivationRule_funnelId_key" ON "ActivationRule"("funnelId");

-- AddForeignKey
ALTER TABLE "ActivationRule" ADD CONSTRAINT "ActivationRule_funnelId_fkey" FOREIGN KEY ("funnelId") REFERENCES "Funnel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
