"use client"

import { ArrowLeftOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { SessionUser } from "../types/SessionUser";
import MyPost from "./MyPost";

const fetchSessionUser = async () => {
    const res = await axios.get("/api/auth/getSessionUser");
    return res.data;
}

export default function MyProfilePage() {
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
                    MY PROFILE
                </h1>
            </div>
            <div className="mt-2 ml-4 font-extrabold text-2xl">
                {sessionUser?.name.toUpperCase()}'S STORIES
            </div>
            <div className="flex gap-10">
                <div className="flex flex-col items-center ml-6 font-semibold">
                    <div className="pt-3 text-lg">
                        {sessionUser?.posts.length}
                    </div>
                    <div>
                        Posts
                    </div>
                </div>
                <div className="flex flex-col items-center font-semibold">
                    <div className="pt-3 text-lg">
                        {sessionUser?.followers.length}
                    </div>
                    <div>
                        Followers
                    </div>
                </div>
            </div>
            <div>
                {sessionUser?.posts.map((post) => (
                    <MyPost
                        id={post.id}
                        avatar={sessionUser.image}
                        name={sessionUser.name}
                        title={post.title}
                        content={post.content}
                        comments={post.comments}
                        likes={post.likes}
                    />
                ))}
            </div>
        </div>
    )
}