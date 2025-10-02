/*
  Warnings:

  - Made the column `scanned` on table `QR` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."QR" ALTER COLUMN "scanned" SET NOT NULL,
ALTER COLUMN "scanned" SET DEFAULT false;
