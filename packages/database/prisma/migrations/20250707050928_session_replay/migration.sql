-- CreateTable
CREATE TABLE "SessionReplay" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "s3Key" TEXT NOT NULL,
    "eventCount" INTEGER NOT NULL,

    CONSTRAINT "SessionReplay_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SessionReplay_projectId_sessionId_idx" ON "SessionReplay"("projectId", "sessionId");

-- AddForeignKey
ALTER TABLE "SessionReplay" ADD CONSTRAINT "SessionReplay_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
