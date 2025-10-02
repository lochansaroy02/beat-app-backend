/*
  Warnings:

  - You are about to drop the column `scanned` on the `QR` table. All the data in the column will be lost.
  - You are about to drop the column `qRId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_qRId_fkey";

-- DropIndex
DROP INDEX "public"."User_qRId_key";

-- AlterTable
ALTER TABLE "public"."QR" DROP COLUMN "scanned",
ADD COLUMN     "isScanned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "scannedBy" TEXT,
ADD COLUMN     "scannedOn" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "qRId";
