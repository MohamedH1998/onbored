/*
  Warnings:

  - You are about to drop the `ActivationRule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FlowInsight` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FlowPathInsight` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SessionReplay` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StepInsight` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `domain` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ActivationRule" DROP CONSTRAINT "ActivationRule_funnelId_fkey";

-- DropForeignKey
ALTER TABLE "ActivationRule" DROP CONSTRAINT "ActivationRule_projectId_fkey";

-- DropForeignKey
ALTER TABLE "FlowInsight" DROP CONSTRAINT "FlowInsight_funnelId_fkey";

-- DropForeignKey
ALTER TABLE "FlowInsight" DROP CONSTRAINT "FlowInsight_projectId_fkey";

-- DropForeignKey
ALTER TABLE "FlowPathInsight" DROP CONSTRAINT "FlowPathInsight_funnelId_fkey";

-- DropForeignKey
ALTER TABLE "FlowPathInsight" DROP CONSTRAINT "FlowPathInsight_projectId_fkey";

-- DropForeignKey
ALTER TABLE "SessionReplay" DROP CONSTRAINT "SessionReplay_apiKeyId_fkey";

-- DropForeignKey
ALTER TABLE "SessionReplay" DROP CONSTRAINT "SessionReplay_projectId_fkey";

-- DropForeignKey
ALTER TABLE "StepInsight" DROP CONSTRAINT "StepInsight_funnelId_fkey";

-- DropForeignKey
ALTER TABLE "StepInsight" DROP CONSTRAINT "StepInsight_projectId_fkey";

-- DropForeignKey
ALTER TABLE "domain" DROP CONSTRAINT "domain_projectId_fkey";

-- DropTable
DROP TABLE "ActivationRule";

-- DropTable
DROP TABLE "FlowInsight";

-- DropTable
DROP TABLE "FlowPathInsight";

-- DropTable
DROP TABLE "SessionReplay";

-- DropTable
DROP TABLE "StepInsight";

-- DropTable
DROP TABLE "domain";
