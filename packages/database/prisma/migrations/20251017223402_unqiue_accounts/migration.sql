/*
  Warnings:

  - A unique constraint covering the columns `[workspaceId,accountId]` on the table `CustomerAccount` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `accountId` to the `CustomerAccount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CustomerAccount" ADD COLUMN     "accountId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "CustomerAccount_accountId_idx" ON "CustomerAccount"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerAccount_workspaceId_accountId_key" ON "CustomerAccount"("workspaceId", "accountId");
