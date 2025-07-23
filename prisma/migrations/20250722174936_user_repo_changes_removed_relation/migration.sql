-- DropForeignKey
ALTER TABLE "UserRepo" DROP CONSTRAINT "UserRepo_userId_fkey";

-- DropIndex
DROP INDEX "UserRepo_userId_repoId_key";
