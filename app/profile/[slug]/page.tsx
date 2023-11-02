"use client"

import Post from "@/app/components/Post";
import ScrollingNewCreators from "@/app/components/ScrollingNewCreators";
import SideBarMyPost from "@/app/components/SideBarMyPost";
import SideBarPosts from "@/app/components/SideBarPosts";
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
    if (!sessionUser) {
        router.push("/");
    };
    if (sessionUser?.id === data?.id) {
        router.push("/");
    };
    const { mutate } = useMutation(
        async () => { await axios.post("/api/auth/followUser", { id: data?.id }) },
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries(["sessionUser"]);
                queryClient.invalidateQueries(["user-posts"]);
            },
            onError: (error) => {
                queryClient.invalidateQueries(["sessionUser"]);
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
            <div className="bg-dark-orange sm:p-7 flex gap-1">
                <button onClick={() => router.back()}>
                    <ArrowLeftOutlined className="ml-2 text-2xl text-off-white sm:hidden" />
                </button>
                <h1 className="text-2xl font-bold font-verdana text-off-white p-3 sm:hidden">
                    PROFILE
                </h1>
            </div>
            <div className="sm:flex sm:mt-8 sm:mx-12 sm:justify-center relative">
                <div className="hidden sm:block sm:w-72 2xl:w-96 sticky">
                    <div className="border rounded-3xl pl-2">
                        <h1 className="font-montserrat text-2xl font-bold mt-2 ml-1">
                            Personal
                        </h1>
                        <SideBarPosts
                            sessionUser={sessionUser}
                        />
                    </div>
                </div>
                <div className="sm:w-2/5 2xl:w-1/3 sm:mx-8">
                    <div className="mt-2 ml-4 font-extrabold text-2xl sm:hidden font-verdana">
                        {data?.name.toUpperCase()}'S STORIES
                    </div>
                    <div className="sm:flex gap-2 hidden">
                        <button onClick={() => router.back()}>
                            <ArrowLeftOutlined className="ml-2 text-lg" />
                        </button>
                        <h1 className="text-2xl font-extrabold cursor-pointer hidden sm:block font-verdana">
                            {data?.name.toUpperCase()}'S STORIES
                        </h1>
                    </div>
                    <div className="flex gap-10 font-montserrat">
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
                                {data?.followers.length}
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
                <div className="hidden sm:block sm:w-80 2xl:w-96 mt-6 sticky right-16">
                    <ScrollingNewCreators sessionUser={sessionUser} />
                    <div className="border rounded-3xl pl-2 mt-4">
                        <h1 className="font-montserrat text-2xl font-bold mt-2 ml-1">
                            My Stories
                        </h1>
                        <SideBarMyPost
                            sessionUser={sessionUser}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}