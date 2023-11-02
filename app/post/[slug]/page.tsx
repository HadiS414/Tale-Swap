"use client"

import Post from "../../components/Post";
import { PostType } from "../../types/Post";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { ArrowLeftOutlined, EllipsisOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import AddComment from "@/app/components/AddComment";
import { Dropdown } from "antd";
import { SessionUser } from "@/app/types/SessionUser";
import { useState } from "react";
import SideBarPosts from "@/app/components/SideBarPosts";
import ScrollingNewCreators from "@/app/components/ScrollingNewCreators";
import SideBarMyPost from "@/app/components/SideBarMyPost";

type URL = {
    params: {
        slug: string
    }
}

const fetchPostDetails = async (slug: string) => {
    const response = await axios.get(`/api/posts/${slug}`);
    return response.data;
}

const fetchSessionUser = async () => {
    const res = await axios.get("/api/auth/getSessionUser");
    return res.data;
}

export default function PostDetails(url: URL) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [selectedComment, setSelectedComment] = useState("");
    const { data, isLoading } = useQuery<PostType>({
        queryFn: () => fetchPostDetails(url.params.slug),
        queryKey: ["detail-post"]
    })
    const { data: sessionUser } = useQuery<SessionUser>({
        queryFn: fetchSessionUser,
        queryKey: ["sessionUser"]
    });
    if (!sessionUser) {
        router.push("/");
    };

    const { mutate } = useMutation(
        async (id: string) => await axios.delete(`/api/posts/deleteComment/${id}`),
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries(["posts"]);
                queryClient.invalidateQueries(["detail-post"]);
            },
            onError: (error) => {
                queryClient.invalidateQueries(["posts"]);
                queryClient.invalidateQueries(["detail-post"]);
            }
        }
    )

    const items = [
        {
            key: 'delete',
            label: (
                <button className="text-red-600 font-bold font-montserrat" onClick={() => mutate(selectedComment)}>
                    Delete
                </button>
            ),
        }
    ];

    if (isLoading) {
        return "Loading...";
    }

    return (
        <div>
            <div className="bg-dark-orange sm:p-7 flex gap-1">
                <button onClick={() => router.back()}>
                    <ArrowLeftOutlined className="ml-2 text-2xl text-off-white sm:hidden" />
                </button>
                <h1 className="text-2xl font-bold font-verdana text-off-white p-3 sm:hidden">
                    VIEW STORY
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
                    <div className="sm:flex gap-2 hidden">
                        <button onClick={() => router.back()}>
                            <ArrowLeftOutlined className="ml-2 text-lg" />
                        </button>
                        <h1 className="text-2xl font-extrabold cursor-pointer hidden sm:block font-verdana">
                            VIEW STORY
                        </h1>
                    </div>
                    {data &&
                        <Post
                            id={data.id}
                            name={data.user.name}
                            avatar={data.user.image}
                            title={data.title}
                            content={data.content}
                            comments={data.comments}
                            likes={data.likes}
                            creatorId={data.user.id}
                        />
                    }
                    {data?.comments?.map((comment) => (
                        <div key={comment.id} className="font-montserrat mx-6 sm:ml-0 sm:mr-2 sm:mt-1 border-b-2">
                            <div className="flex items-center gap-2">
                                <Image
                                    className="rounded-full"
                                    width={32}
                                    height={32}
                                    src={comment.user?.image}
                                    alt="Avatar..."
                                />
                                <h3 className="font-bold"> {comment?.user?.name} </h3>
                            </div>
                            <div className="py-2 flex items-center justify-between">
                                <div>
                                    {comment.content}
                                </div>
                                <div>
                                    {(data.user.id === sessionUser?.id || comment.userId === sessionUser?.id) &&
                                        <Dropdown menu={{ items }} onOpenChange={() => setSelectedComment(comment.id)}>
                                            <EllipsisOutlined />
                                        </Dropdown>
                                    }
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="sticky bottom-0">
                        <AddComment id={data?.id} />
                    </div>
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