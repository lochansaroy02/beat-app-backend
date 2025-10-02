/*
  Warnings:

  - You are about to drop the column `personId` on the `Address` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Person" DROP CONSTRAINT "Person_addressId_fkey";

-- AlterTable
ALTER TABLE "public"."Address" DROP COLUMN "personId";

-- AlterTable
ALTER TABLE "public"."Person" ALTER COLUMN "addressId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Person" ADD CONSTRAINT "Person_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "public"."Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;
