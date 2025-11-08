-- AlterTable
ALTER TABLE "SessionReplay" ADD COLUMN     "apiKeyId" TEXT,
ALTER COLUMN "s3Key" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "SessionReplay" ADD CONSTRAINT "SessionReplay_apiKeyId_fkey" FOREIGN KEY ("apiKeyId") REFERENCES "ApiKey"("id") ON DELETE SET NULL ON UPDATE CASCADE;
