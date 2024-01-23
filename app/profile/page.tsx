"use client"

import { ArrowLeftOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { SessionUser } from "../types/SessionUser";
import MyPost from "./MyPost";
import SideBarPosts from "../components/SideBarPosts";
import ScrollingNewCreators from "../components/ScrollingNewCreators";

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

    return (
        <div>
            <div className="bg-dark-orange sm:p-7 flex gap-1">
                <button onClick={() => router.back()}>
                    <ArrowLeftOutlined className="ml-2 text-2xl text-off-white sm:hidden" />
                </button>
                <h1 className="text-2xl font-bold font-verdana text-off-white p-3 sm:hidden">
                    MY PROFILE
                </h1>
            </div>
            <div className="sm:flex sm:mt-8 sm:mx-12 sm:justify-center relative">
                <div className="hidden sm:block sm:w-72 2xl:w-96 sticky">
                    <div className="border shadow rounded-3xl pl-2">
                        <SideBarPosts
                            sessionUser={sessionUser}
                        />
                    </div>
                </div>
                <div className="sm:w-2/5 2xl:w-1/3 sm:mx-8">
                    <div className="sm:flex gap-2 hidden">
                        <div className="mt-2 ml-4 font-extrabold text-2xl sm:hidden font-verdana">
                            {sessionUser?.name.toUpperCase()}'S STORIES
                        </div>
                        <button onClick={() => router.back()}>
                            <ArrowLeftOutlined className="ml-2 text-lg" />
                        </button>
                        <h1 className="text-2xl font-extrabold cursor-pointer hidden sm:block font-verdana">
                            {sessionUser?.name.toUpperCase()}'S STORIES
                        </h1>
                    </div>
                    <div className="flex gap-10 font-montserrat">
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
                <div className="hidden sm:block sm:w-80 2xl:w-96 mt-6 sticky right-16">
                    <ScrollingNewCreators sessionUser={sessionUser} />
                </div>
            </div>
        </div>
    )
}