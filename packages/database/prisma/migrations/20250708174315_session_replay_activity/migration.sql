/*
  Warnings:

  - The values [RAGE_CLICK,ERROR_CLICK,DEAD_CLICK,REPEATED_CLICK,LONG_PAUSE,RESOURCE_LOAD_FAILURE,MULTIPLE_INPUT_RETRIES] on the enum `InsightType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `processed` on the `SessionInsight` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "InsightType_new" AS ENUM ('RAGE_CLICKS', 'DEAD_CLICKS', 'ERROR_CLICKS', 'REPEATED_CLICKS', 'MISCLICK', 'LONG_IDLE', 'FAST_EXIT', 'HESITATION', 'HIGH_TIME_ON_STEP', 'LOW_TIME_ON_STEP', 'FORM_ABANDON', 'FORM_INPUT_RETRY', 'STEP_SKIPPED', 'FLOW_INCOMPLETE', 'BACKTRACK', 'LOOPING', 'MULTITAB_BEHAVIOR', 'U_TURN', 'JS_ERROR', 'NETWORK_FAILURE', 'SLOW_PAGE_LOAD', 'RESOURCE_FAIL', 'ELEMENT_HIDDEN', 'BUTTON_DISABLED', 'CTA_NOT_FOUND', 'MODAL_BLOCKED', 'BELOW_FOLD_CTA', 'COMPLETION', 'KEY_ACTION_SUCCESS', 'CONTEXTUAL_SUCCESS', 'COPY_PASTE', 'TEXT_SELECTION', 'ZOOM', 'CONSOLE_OPENED', 'RAPID_NAVIGATION', 'HIGH_SCROLL', 'LOW_SCROLL', 'SCROLL_JANK', 'FUNNEL_BOUNCE', 'FUNNEL_COMPLETION', 'FUNNEL_LOOP', 'INTENT_MISMATCH', 'STRUGGLE_INFERRED', 'DESIGN_CONFUSION', 'UNEXPECTED_PATH', 'OTHER');
ALTER TABLE "SessionInsight" ALTER COLUMN "insightType" TYPE "InsightType_new" USING ("insightType"::text::"InsightType_new");
ALTER TYPE "InsightType" RENAME TO "InsightType_old";
ALTER TYPE "InsightType_new" RENAME TO "InsightType";
DROP TYPE "InsightType_old";
COMMIT;

-- AlterTable
ALTER TABLE "SessionInsight" DROP COLUMN "processed",
ADD COLUMN     "sessionReplayId" TEXT;

-- AlterTable
ALTER TABLE "SessionReplay" ADD COLUMN     "hasFunnelActivity" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "processed" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "SessionInsight" ADD CONSTRAINT "SessionInsight_sessionReplayId_fkey" FOREIGN KEY ("sessionReplayId") REFERENCES "SessionReplay"("id") ON DELETE SET NULL ON UPDATE CASCADE;
