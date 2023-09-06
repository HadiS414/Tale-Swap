"use client"

import Post from "@/app/components/Post";
import { SessionUser } from "@/app/types/SessionUser";
import { User } from "@/app/types/User";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";

type URL = {
    params: {
        slug: string
    }
}

const fetchSessionUser = async () => {
    const res = await axios.get("/api/auth/getSessionUser");
    return res.data;
}

const fetchUserDetails = async (slug: string) => {
    const response = await axios.get(`/api/posts/profile/${slug}`);
    return response.data;
}

export default function ProfilePage(url: URL) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { data: sessionUser } = useQuery<SessionUser>({
        queryFn: fetchSessionUser,
        queryKey: ["sessionUser"]
    });
    const { data, isLoading } = useQuery<User>({
        queryFn: () => fetchUserDetails(url.params.slug),
        queryKey: ["user-posts"]
    })
    if (sessionUser?.id === data?.id) {
        router.push("/");
    };
    const { mutate } = useMutation(
        async () => { await axios.post("/api/auth/followUser", { id: data?.id }) },
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries(["posts"]);
                queryClient.invalidateQueries(["sessionUser"]);
                queryClient.invalidateQueries(["following-posts"]);
                queryClient.invalidateQueries(["genre-posts"]);
                queryClient.invalidateQueries(["detail-post"]);
                queryClient.invalidateQueries(["user-posts"]);
            },
            onError: (error) => {
                queryClient.invalidateQueries(["posts"]);
                queryClient.invalidateQueries(["sessionUser"]);
                queryClient.invalidateQueries(["following-posts"]);
                queryClient.invalidateQueries(["genre-posts"]);
                queryClient.invalidateQueries(["detail-post"]);
                queryClient.invalidateQueries(["user-posts"]);
            }
        }
    )
    if (isLoading) {
        return <h1> Loading... </h1>
    }

    const userFollowedBySessionUser = sessionUser?.following?.find((followedUser) => followedUser.followingId === data?.id);

    return (
        <div>
            <div className="bg-dark-orange flex gap-1">
                <button onClick={() => router.back()}>
                    <ArrowLeftOutlined className="ml-2 text-2xl text-off-white" />
                </button>
                <h1 className="text-2xl font-bold font-verdana text-off-white p-3">
                    PROFILE
                </h1>
            </div>
            <div className="mt-2 ml-4 font-extrabold text-2xl">
                {data?.name.toUpperCase()}'S STORIES
            </div>
            <div className="flex gap-10">
                <div className="flex flex-col items-center ml-6 font-semibold">
                    <div className="pt-3 text-lg">
                        {data?.posts.length}
                    </div>
                    <div>
                        Posts
                    </div>
                </div>
                <div className="flex flex-col items-center font-semibold">
                    <div className="pt-3 text-lg">
                        25
                    </div>
                    <div>
                        Followers
                    </div>
                </div>
                <div className="flex items-center">
                    <button onClick={() => mutate()} className={`rounded-full py-[3px] px-4 border border-black ${userFollowedBySessionUser ? "bg-off-white text-black" : "bg-blue-500 text-off-white"}`}>
                        {userFollowedBySessionUser ? <p> Unfollow </p> : <p> Follow </p>}
                    </button>
                </div>
            </div>
            {data?.posts?.map((post) => (
                <Post
                    id={post.id}
                    name={post.user.name}
                    avatar={post.user.image}
                    title={post.title}
                    content={post.content}
                    comments={post.comments}
                    likes={post.likes}
                    creatorId={post.user.id}
                />
            ))}
        </div>
    )
}