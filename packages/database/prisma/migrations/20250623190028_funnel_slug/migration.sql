/*
  Warnings:

  - A unique constraint covering the columns `[projectId,slug]` on the table `Funnel` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Funnel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Funnel" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Funnel_projectId_slug_key" ON "Funnel"("projectId", "slug");
