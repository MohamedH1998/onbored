/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Funnel` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Funnel_slug_key" ON "Funnel"("slug");
