-- CreateTable
CREATE TABLE "FellGroup" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,

    CONSTRAINT "FellGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fell" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT,
    "description" TEXT,
    "userId" INTEGER,

    CONSTRAINT "Fell_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "oAuthUid" TEXT NOT NULL,
    "profileUrl" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FellToFellGroup" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FellToFellGroup_AB_unique" ON "_FellToFellGroup"("A", "B");

-- CreateIndex
CREATE INDEX "_FellToFellGroup_B_index" ON "_FellToFellGroup"("B");

-- AddForeignKey
ALTER TABLE "Fell" ADD CONSTRAINT "Fell_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FellToFellGroup" ADD CONSTRAINT "_FellToFellGroup_A_fkey" FOREIGN KEY ("A") REFERENCES "Fell"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FellToFellGroup" ADD CONSTRAINT "_FellToFellGroup_B_fkey" FOREIGN KEY ("B") REFERENCES "FellGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
