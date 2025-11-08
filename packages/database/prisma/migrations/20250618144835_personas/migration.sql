/*
  Warnings:

  - You are about to drop the column `goal` on the `Persona` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Persona" DROP COLUMN "goal";

-- CreateTable
CREATE TABLE "Goal" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "Goal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PersonaGoals" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PersonaGoals_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Goal_label_key" ON "Goal"("label");

-- CreateIndex
CREATE INDEX "_PersonaGoals_B_index" ON "_PersonaGoals"("B");

-- AddForeignKey
ALTER TABLE "_PersonaGoals" ADD CONSTRAINT "_PersonaGoals_A_fkey" FOREIGN KEY ("A") REFERENCES "Goal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PersonaGoals" ADD CONSTRAINT "_PersonaGoals_B_fkey" FOREIGN KEY ("B") REFERENCES "Persona"("id") ON DELETE CASCADE ON UPDATE CASCADE;
