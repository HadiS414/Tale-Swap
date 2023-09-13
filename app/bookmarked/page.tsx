"use client"

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { SessionUser } from "../types/SessionUser";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Post from "../components/Post";

const fetchSessionUser = async () => {
    const res = await axios.get("/api/auth/getSessionUser");
    return res.data;
}

export default function BookMarkedPage() {
    const router = useRouter();
    const { data: sessionUser, isLoading } = useQuery<SessionUser>({
        queryFn: fetchSessionUser,
        queryKey: ["sessionUser"]
    });
    if (!sessionUser) {
        router.push("/");
    };
    if (isLoading) {
        return <h1> Loading... </h1>
    }

    return (
        <div>
            <div className="bg-dark-orange flex gap-1">
                <button onClick={() => router.back()}>
                    <ArrowLeftOutlined className="ml-2 text-2xl text-off-white" />
                </button>
                <h1 className="text-2xl font-bold font-verdana text-off-white p-3">
                    BOOKMARKED
                </h1>
            </div>
            {sessionUser?.savedPosts?.map((post) => (
                <Post
                    id={post.post.id}
                    name={post.post.user.name}
                    avatar={post.post.user.image}
                    title={post.post.title}
                    content={post.post.content}
                    comments={post.post.comments}
                    likes={post.post.likes}
                    creatorId={post.post.user.id}
                />
            ))}
        </div>
    )
}