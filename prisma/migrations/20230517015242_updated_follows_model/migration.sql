/*
  Warnings:

  - The primary key for the `Follows` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `followerId` to the `Follows` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Follows` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "Follows" DROP CONSTRAINT "Follows_followingId_fkey";

-- AlterTable
ALTER TABLE "Follows" DROP CONSTRAINT "Follows_pkey",
ADD COLUMN     "followerId" TEXT NOT NULL,
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Follows_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Follows" ADD CONSTRAINT "Follows_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
