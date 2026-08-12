/*
  Warnings:

  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Faq` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductCategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Category";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Faq";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ProductCategory";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "CategoryProduct" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "categoryType" TEXT NOT NULL,
    "orderdisplay" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT NOT NULL DEFAULT '',
    "image" TEXT
);

-- CreateTable
CREATE TABLE "CategoryAssignmentProduct" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "categoryProductId" TEXT NOT NULL,
    CONSTRAINT "CategoryAssignmentProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CategoryAssignmentProduct_categoryProductId_fkey" FOREIGN KEY ("categoryProductId") REFERENCES "CategoryProduct" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FaqBrand" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "useBy" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    CONSTRAINT "FaqBrand_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "CategoryAssignmentProduct_productId_categoryProductId_key" ON "CategoryAssignmentProduct"("productId", "categoryProductId");

-- CreateIndex
CREATE INDEX "FaqBrand_brandId_idx" ON "FaqBrand"("brandId");
