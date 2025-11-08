-- CreateTable
CREATE TABLE "SessionInsight" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SessionInsight_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SessionInsight_projectId_idx" ON "SessionInsight"("projectId");

-- CreateIndex
CREATE INDEX "SessionInsight_sessionId_idx" ON "SessionInsight"("sessionId");

-- AddForeignKey
ALTER TABLE "SessionInsight" ADD CONSTRAINT "SessionInsight_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "OnboredSessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionInsight" ADD CONSTRAINT "SessionInsight_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
