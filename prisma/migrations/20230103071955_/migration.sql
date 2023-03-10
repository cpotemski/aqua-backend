-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('Aluminium', 'Steel', 'Plutonium');

-- CreateEnum
CREATE TYPE "ShipName" AS ENUM ('Piranha', 'Jellyfish', 'Shark', 'HackBoat', 'Taifun', 'Blizzard', 'Hurricane', 'Tsunami', 'Enterprise', 'Bermuda', 'KittyHawk', 'Atlantis');

-- CreateEnum
CREATE TYPE "ShipType" AS ENUM ('Normal', 'Emp', 'FirstStrike');

-- CreateEnum
CREATE TYPE "BuildOrderType" AS ENUM ('Ship', 'Harvester');

-- CreateEnum
CREATE TYPE "FleetActionType" AS ENUM ('Attack', 'Defend');

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Station" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "resourcesId" TEXT NOT NULL,
    "coordinatesId" TEXT NOT NULL,
    "harvesters" INTEGER NOT NULL DEFAULT 10,
    "distribution" INTEGER[] DEFAULT ARRAY[50, 30]::INTEGER[],

    CONSTRAINT "Station_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fleet" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "targetId" TEXT,
    "baseFleet" BOOLEAN NOT NULL DEFAULT false,
    "resourcesId" TEXT,
    "travelTime" INTEGER,
    "remainingTime" INTEGER,
    "action" "FleetActionType",
    "actionTicks" INTEGER,
    "returning" BOOLEAN,

    CONSTRAINT "Fleet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ships" (
    "id" TEXT NOT NULL,
    "fleetId" TEXT NOT NULL,
    "piranha" INTEGER NOT NULL DEFAULT 0,
    "jellyfish" INTEGER NOT NULL DEFAULT 0,
    "shark" INTEGER NOT NULL DEFAULT 0,
    "hackboat" INTEGER NOT NULL DEFAULT 0,
    "taifun" INTEGER NOT NULL DEFAULT 0,
    "blizzard" INTEGER NOT NULL DEFAULT 0,
    "hurricane" INTEGER NOT NULL DEFAULT 0,
    "tsunami" INTEGER NOT NULL DEFAULT 0,
    "enterprise" INTEGER NOT NULL DEFAULT 0,
    "bermuda" INTEGER NOT NULL DEFAULT 0,
    "kittyhawk" INTEGER NOT NULL DEFAULT 0,
    "atlantis" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Ships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resources" (
    "id" TEXT NOT NULL,
    "aluminium" INTEGER NOT NULL DEFAULT 0,
    "steel" INTEGER NOT NULL DEFAULT 0,
    "plutonium" INTEGER NOT NULL DEFAULT 0,
    "energy" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResourceNode" (
    "id" TEXT NOT NULL,
    "type" "ResourceType" NOT NULL,
    "coordinatesId" TEXT NOT NULL,

    CONSTRAINT "ResourceNode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Coordinates" (
    "id" TEXT NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,

    CONSTRAINT "Coordinates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuildOrder" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "type" "BuildOrderType" NOT NULL,
    "what" "ShipName" NOT NULL,
    "amount" INTEGER NOT NULL,
    "remainingTime" INTEGER NOT NULL,

    CONSTRAINT "BuildOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Player_email_key" ON "Player"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Player_name_key" ON "Player"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Station_name_key" ON "Station"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Station_ownerId_key" ON "Station"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "Station_resourcesId_key" ON "Station"("resourcesId");

-- CreateIndex
CREATE UNIQUE INDEX "Station_coordinatesId_key" ON "Station"("coordinatesId");

-- CreateIndex
CREATE UNIQUE INDEX "Fleet_resourcesId_key" ON "Fleet"("resourcesId");

-- CreateIndex
CREATE UNIQUE INDEX "Ships_fleetId_key" ON "Ships"("fleetId");

-- CreateIndex
CREATE UNIQUE INDEX "ResourceNode_coordinatesId_key" ON "ResourceNode"("coordinatesId");

-- CreateIndex
CREATE UNIQUE INDEX "Coordinates_x_y_key" ON "Coordinates"("x", "y");

-- AddForeignKey
ALTER TABLE "Station" ADD CONSTRAINT "Station_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Station" ADD CONSTRAINT "Station_resourcesId_fkey" FOREIGN KEY ("resourcesId") REFERENCES "Resources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Station" ADD CONSTRAINT "Station_coordinatesId_fkey" FOREIGN KEY ("coordinatesId") REFERENCES "Coordinates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fleet" ADD CONSTRAINT "Fleet_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fleet" ADD CONSTRAINT "Fleet_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fleet" ADD CONSTRAINT "Fleet_resourcesId_fkey" FOREIGN KEY ("resourcesId") REFERENCES "Resources"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ships" ADD CONSTRAINT "Ships_fleetId_fkey" FOREIGN KEY ("fleetId") REFERENCES "Fleet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResourceNode" ADD CONSTRAINT "ResourceNode_coordinatesId_fkey" FOREIGN KEY ("coordinatesId") REFERENCES "Coordinates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuildOrder" ADD CONSTRAINT "BuildOrder_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
