-- RenameForeignKey
ALTER TABLE "Post" RENAME CONSTRAINT "Post_userId_fkey" TO "user_posts";

-- AddForeignKey
ALTER TABLE "Follows" ADD CONSTRAINT "Follows_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
