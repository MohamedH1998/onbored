/*
  Warnings:

  - A unique constraint covering the columns `[funnelId,interval,intervalStart]` on the table `FlowInsight` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `intervalEnd` to the `FlowInsight` table without a default value. This is not possible if the table is not empty.
  - Added the required column `intervalStart` to the `FlowInsight` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "InsightInterval" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY');

-- AlterTable
ALTER TABLE "FlowInsight" ADD COLUMN     "interval" "InsightInterval" NOT NULL DEFAULT 'DAILY',
ADD COLUMN     "intervalEnd" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "intervalStart" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "FlowInsight_funnelId_interval_intervalStart_key" ON "FlowInsight"("funnelId", "interval", "intervalStart");
