-- CreateTable
CREATE TABLE "domain" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "domain_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "domain_projectId_idx" ON "domain"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "domain_projectId_url_key" ON "domain"("projectId", "url");

-- AddForeignKey
ALTER TABLE "domain" ADD CONSTRAINT "domain_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
