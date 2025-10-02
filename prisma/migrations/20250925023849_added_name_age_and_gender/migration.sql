/*
  Warnings:

  - Added the required column `age` to the `Person` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `Person` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Person` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Person" ADD COLUMN     "age" TEXT NOT NULL,
ADD COLUMN     "gender" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;
