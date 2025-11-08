-- CreateEnum
CREATE TYPE "FunnelStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- AlterTable
ALTER TABLE "Funnel" ADD COLUMN     "status" "FunnelStatus" NOT NULL DEFAULT 'DRAFT';
