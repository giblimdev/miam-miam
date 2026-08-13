/*
  Warnings:

  - You are about to drop the column `brandId` on the `Gallery` table. All the data in the column will be lost.
  - You are about to drop the column `ownerId` on the `Gallery` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `Gallery` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `targetId` to the `Gallery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `targetType` to the `Gallery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updateAt` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Profil` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Address" ADD COLUMN "deletedAt" DATETIME;

-- AlterTable
ALTER TABLE "BlogPost" ADD COLUMN "deletedAt" DATETIME;

-- AlterTable
ALTER TABLE "LoyaltyAccount" ADD COLUMN "deletedAt" DATETIME;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN "shippingAddressId" TEXT;

-- CreateTable
CREATE TABLE "ProductSpec" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "unit" TEXT,
    "productId" TEXT NOT NULL,
    CONSTRAINT "ProductSpec_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProductRelation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "relatedProductId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "orderdisplay" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProductRelation_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProductRelation_relatedProductId_fkey" FOREIGN KEY ("relatedProductId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CategoryProduct" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "categoryType" TEXT NOT NULL,
    "orderdisplay" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT NOT NULL DEFAULT '',
    "image" TEXT,
    "parentId" TEXT,
    CONSTRAINT "CategoryProduct_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "CategoryProduct" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_CategoryProduct" ("categoryType", "description", "id", "image", "name", "orderdisplay") SELECT "categoryType", "description", "id", "image", "name", "orderdisplay" FROM "CategoryProduct";
DROP TABLE "CategoryProduct";
ALTER TABLE "new_CategoryProduct" RENAME TO "CategoryProduct";
CREATE INDEX "CategoryProduct_parentId_idx" ON "CategoryProduct"("parentId");
CREATE TABLE "new_Gallery" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "altText" TEXT NOT NULL,
    "description" TEXT,
    "mainImage" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL
);
INSERT INTO "new_Gallery" ("altText", "createdAt", "description", "id", "mainImage", "name", "updatedAt") SELECT "altText", "createdAt", "description", "id", "mainImage", "name", "updatedAt" FROM "Gallery";
DROP TABLE "Gallery";
ALTER TABLE "new_Gallery" RENAME TO "Gallery";
CREATE TABLE "new_Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "updateAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Notification" ("body", "createdAt", "id", "isRead", "title", "type", "userId") SELECT "body", "createdAt", "id", "isRead", "title", "type", "userId" FROM "Notification";
DROP TABLE "Notification";
ALTER TABLE "new_Notification" RENAME TO "Notification";
CREATE TABLE "new_Profil" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bio" TEXT NOT NULL DEFAULT '',
    "preferredLanguage" TEXT NOT NULL DEFAULT 'FR',
    "userId" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "notifPush" BOOLEAN NOT NULL DEFAULT true,
    "notifEmail" BOOLEAN NOT NULL DEFAULT true,
    "notifSms" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Profil_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Profil" ("bio", "id", "notifEmail", "notifPush", "notifSms", "phone", "preferredLanguage", "userId") SELECT "bio", "id", "notifEmail", "notifPush", "notifSms", "phone", "preferredLanguage", "userId" FROM "Profil";
DROP TABLE "Profil";
ALTER TABLE "new_Profil" RENAME TO "Profil";
CREATE UNIQUE INDEX "Profil_userId_key" ON "Profil"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "ProductSpec_productId_idx" ON "ProductSpec"("productId");

-- CreateIndex
CREATE INDEX "ProductRelation_productId_idx" ON "ProductRelation"("productId");

-- CreateIndex
CREATE INDEX "ProductRelation_relatedProductId_idx" ON "ProductRelation"("relatedProductId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductRelation_productId_relatedProductId_type_key" ON "ProductRelation"("productId", "relatedProductId", "type");

-- CreateIndex
CREATE INDEX "CategoryAssignmentProduct_productId_idx" ON "CategoryAssignmentProduct"("productId");

-- CreateIndex
CREATE INDEX "CategoryAssignmentProduct_categoryProductId_idx" ON "CategoryAssignmentProduct"("categoryProductId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
