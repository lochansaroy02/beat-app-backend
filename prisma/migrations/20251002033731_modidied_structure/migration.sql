/*
  Warnings:

  - You are about to drop the column `userId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[pnoNo]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[qRId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `pnoNo` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `qRId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "userId",
ADD COLUMN     "pnoNo" TEXT NOT NULL,
ADD COLUMN     "qRId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_pnoNo_key" ON "public"."User"("pnoNo");

-- CreateIndex
CREATE UNIQUE INDEX "User_qRId_key" ON "public"."User"("qRId");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_qRId_fkey" FOREIGN KEY ("qRId") REFERENCES "public"."QR"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
