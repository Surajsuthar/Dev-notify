/*
  Warnings:

  - You are about to drop the column `telegramUsername` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `whatsappNumber` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_telegramUsername_key";

-- DropIndex
DROP INDEX "User_whatsappNumber_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "telegramUsername",
DROP COLUMN "whatsappNumber";
