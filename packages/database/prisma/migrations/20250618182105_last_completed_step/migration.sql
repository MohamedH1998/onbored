/*
  Warnings:

  - You are about to drop the column `currentStep` on the `OnboardingProgress` table. All the data in the column will be lost.
  - Added the required column `lastCompletedStep` to the `OnboardingProgress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OnboardingProgress" DROP COLUMN "currentStep",
ADD COLUMN     "lastCompletedStep" TEXT NOT NULL;
