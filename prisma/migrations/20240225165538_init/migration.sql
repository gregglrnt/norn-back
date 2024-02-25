-- CreateTable
CREATE TABLE "Century" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
);

-- CreateTable
CREATE TABLE "Country" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "flag" TEXT
);

-- CreateTable
CREATE TABLE "Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "coordinates" TEXT NOT NULL,
    "centuryId" INTEGER NOT NULL,
    "countryId" INTEGER NOT NULL,
    CONSTRAINT "Event_centuryId_fkey" FOREIGN KEY ("centuryId") REFERENCES "Century" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Event_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Country_name_key" ON "Country"("name");
