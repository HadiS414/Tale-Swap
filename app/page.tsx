import AllPosts from "./components/AllPosts";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import prisma from "../prisma/client"

export default async function Home() {
  const session = await getServerSession(authOptions);
  let currentSessionUser;
  if (session) {
    currentSessionUser = await prisma.user.findUnique({
      where: { email: session?.user?.email || undefined }
    });
  }

  return (
    <div>
      <AllPosts sessionUserId={currentSessionUser?.id} />
    </div >
  )
}