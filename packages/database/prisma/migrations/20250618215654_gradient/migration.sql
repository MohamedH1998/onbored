/*
  Warnings:

  - You are about to drop the column `gradient` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Workspace" ADD COLUMN     "gradient" TEXT NOT NULL DEFAULT 'oceanic';

-- AlterTable
ALTER TABLE "user" DROP COLUMN "gradient";
