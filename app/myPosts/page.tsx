import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { redirect } from "next/navigation";
import MyPosts from "../components/MyPosts";

export default async function MyPostsPage() {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("api/auth/signin")
    }

    return (
        <div>
            <MyPosts />
        </div>
    )
}
