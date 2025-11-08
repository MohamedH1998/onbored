/*
  Warnings:

  - Added the required column `insightType` to the `SessionInsight` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "InsightType" AS ENUM ('RAGE_CLICK', 'ERROR_CLICK', 'DEAD_CLICK', 'REPEATED_CLICK', 'LONG_PAUSE', 'FAST_EXIT', 'HESITATION', 'HIGH_TIME_ON_STEP', 'LOW_TIME_ON_STEP', 'FORM_ABANDON', 'STEP_SKIPPED', 'FLOW_INCOMPLETE', 'BACKTRACK', 'LOOPING', 'MULTITAB_BEHAVIOR', 'JS_ERROR', 'NETWORK_FAILURE', 'SLOW_PAGE_LOAD', 'RESOURCE_LOAD_FAILURE', 'COPY_PASTE', 'TEXT_SELECTION', 'ZOOM', 'CONSOLE_OPENED', 'HIGH_SCROLL', 'LOW_SCROLL', 'MULTIPLE_INPUT_RETRIES', 'COMPLETION', 'KEY_ACTION_SUCCESS', 'OTHER');

-- AlterTable
ALTER TABLE "SessionInsight" ADD COLUMN     "insightType" "InsightType" NOT NULL;
