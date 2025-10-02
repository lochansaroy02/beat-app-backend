/*
  Warnings:

  - A unique constraint covering the columns `[relation]` on the table `FamilyMember` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "FamilyMember_relation_key" ON "public"."FamilyMember"("relation");
