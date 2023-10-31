-- DropForeignKey
ALTER TABLE "SavedPost" DROP CONSTRAINT "SavedPost_postId_fkey";

-- AddForeignKey
ALTER TABLE "SavedPost" ADD CONSTRAINT "SavedPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
