-- CreateTable
CREATE TABLE "public"."FamilyMember" (
    "id" TEXT NOT NULL,
    "relation" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "occupation" TEXT NOT NULL,
    "personId" TEXT,

    CONSTRAINT "FamilyMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Person" (
    "id" TEXT NOT NULL,
    "isAcccused" BOOLEAN NOT NULL,
    "dossierNo" TEXT,
    "checkingId" TEXT,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Checking" (
    "id" TEXT NOT NULL,
    "checkingOfficerName" TEXT NOT NULL,
    "policeStation" TEXT NOT NULL,

    CONSTRAINT "Checking_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."FamilyMember" ADD CONSTRAINT "FamilyMember_personId_fkey" FOREIGN KEY ("personId") REFERENCES "public"."Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Person" ADD CONSTRAINT "Person_checkingId_fkey" FOREIGN KEY ("checkingId") REFERENCES "public"."Checking"("id") ON DELETE SET NULL ON UPDATE CASCADE;
