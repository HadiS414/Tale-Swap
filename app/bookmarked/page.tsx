"use client"

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { SessionUser } from "../types/SessionUser";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Post from "../components/Post";
import SideBarPosts from "../components/SideBarPosts";
import ScrollingNewCreators from "../components/ScrollingNewCreators";
import SideBarMyPost from "../components/SideBarMyPost";
import { Skeleton } from "antd";

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

    return (
        <div>
            <div className="bg-dark-orange sm:p-7 flex gap-1">
                <button onClick={() => router.back()}>
                    <ArrowLeftOutlined className="ml-2 text-2xl text-off-white sm:hidden" />
                </button>
                <h1 className="text-2xl font-bold font-verdana text-off-white p-3 sm:hidden">
                    BOOKMARKED
                </h1>
            </div>
            <div className="sm:flex sm:mt-8 sm:mx-12 sm:justify-center relative">
                <div className="hidden sm:block sm:w-72 2xl:w-96 sticky">
                    <div className="border shadow rounded-3xl pl-2 2xl:sticky 2xl:top-32">
                        <SideBarPosts
                            sessionUser={sessionUser}
                        />
                    </div>
                </div>
                <div className="sm:w-2/5 2xl:w-1/3 sm:mx-8">
                    <div className="sm:flex gap-2 hidden">
                        <button onClick={() => router.back()}>
                            <ArrowLeftOutlined className="ml-2 text-lg" />
                        </button>
                        <h1 className="text-2xl font-extrabold cursor-pointer hidden sm:block font-verdana">
                            BOOKMARKED
                        </h1>
                    </div>
                    {!isLoading ?
                        sessionUser?.savedPosts?.map((post) => (
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
                        ))
                        :
                        <>
                            <Skeleton className="mt-2 px-2" active avatar paragraph={{ rows: 4 }} />
                            <Skeleton className="mt-2 px-2" active avatar paragraph={{ rows: 4 }} />
                            <Skeleton className="mt-2 px-2" active avatar paragraph={{ rows: 4 }} />
                            <Skeleton className="mt-2 px-2" active avatar paragraph={{ rows: 4 }} />
                            <Skeleton className="mt-2 px-2" active avatar paragraph={{ rows: 4 }} />
                        </>
                    }
                </div>
                <div className="hidden sm:block sm:w-80 mt-6">
                    <div className="2xl:sticky 2xl:top-32">
                        <ScrollingNewCreators sessionUser={sessionUser} />
                        <div className="border shadow rounded-3xl pl-2 mt-4">
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
        </div>
    )
}