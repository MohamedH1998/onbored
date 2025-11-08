/*
  Warnings:

  - A unique constraint covering the columns `[funnelId,key]` on the table `FunnelStep` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `key` to the `FunnelStep` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FunnelStep" ADD COLUMN     "key" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "FunnelStep_funnelId_key_key" ON "FunnelStep"("funnelId", "key");
