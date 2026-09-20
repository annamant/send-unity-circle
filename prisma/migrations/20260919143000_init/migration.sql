-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "School" (
    "id" TEXT NOT NULL,
    "urn" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "postcode" TEXT NOT NULL,
    "postcodeNorm" TEXT NOT NULL,
    "localAuthority" TEXT NOT NULL,
    "laCode" TEXT NOT NULL,
    "street" TEXT,
    "locality" TEXT,
    "town" TEXT,
    "phase" TEXT,
    "establishmentType" TEXT,
    "website" TEXT,
    "nameSearch" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "School_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WhatsAppGroup" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "inviteUrl" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "submitterNote" TEXT,
    "adminNote" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "liveAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WhatsAppGroup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "School_urn_key" ON "School"("urn");

-- CreateIndex
CREATE UNIQUE INDEX "School_slug_key" ON "School"("slug");

-- CreateIndex
CREATE INDEX "School_localAuthority_idx" ON "School"("localAuthority");

-- CreateIndex
CREATE INDEX "School_postcodeNorm_idx" ON "School"("postcodeNorm");

-- CreateIndex
CREATE INDEX "School_laCode_idx" ON "School"("laCode");

-- CreateIndex
CREATE INDEX "School_nameSearch_idx" ON "School"("nameSearch");

-- CreateIndex
CREATE UNIQUE INDEX "WhatsAppGroup_schoolId_key" ON "WhatsAppGroup"("schoolId");

-- CreateIndex
CREATE INDEX "WhatsAppGroup_status_idx" ON "WhatsAppGroup"("status");

-- AddForeignKey
ALTER TABLE "WhatsAppGroup" ADD CONSTRAINT "WhatsAppGroup_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;
