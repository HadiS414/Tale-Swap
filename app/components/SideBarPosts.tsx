"use client"

import Image from "next/image";
import Link from "next/link";
import { SessionUser } from "../types/SessionUser";
import commentBubble from "../images/CommentBubble.svg";
import heart from "../images/Heart.svg";
import heartFilled from "../images/Heart_Filled.svg";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PostType } from "../types/Post";

type Props = {
    sessionUser?: SessionUser
}

const fetchAllPosts = async () => {
    const res = await axios.get("/api/posts/getPosts");
    return res.data;
}

export default function SideBarPosts({ sessionUser }: Props) {
    const { data, isLoading } = useQuery<PostType[]>({
        queryFn: fetchAllPosts,
        queryKey: ["posts"]
    })
    if (isLoading) {
        return <h1> Loading... </h1>
    }

    return (
        <div>
            {data &&
                data?.slice(0, 3).map((post) => (
                    <Link href={`/post/${post.id}`}>
                        <div className="m-6 sm:ml-0">
                            <div className="flex gap-2">
                                <p className="font-semibold text-md">
                                    {post.title}
                                </p>
                                <div className="flex items-center gap-1">
                                    <Image
                                        className="rounded-full"
                                        width={18}
                                        height={6}
                                        src={post.user.image}
                                        alt="Avatar..."
                                    />
                                    <p className="text-xs font-normal"> {post.user.name} </p>
                                </div>
                            </div>
                            <div className="my-4">
                                <p className="break-normal"> {post.content.substring(0, 200)}... </p>
                            </div>
                            <div className="flex items-center justify-between pb-1">
                                <div className="flex gap-2 items-center">
                                    <div className="flex gap-1 items-center">
                                        {post.likes.length}
                                        <div>
                                            {post.likes.find((like) => like.userId === sessionUser?.id) ?
                                                <Image
                                                    className="text-blue-500"
                                                    width={24}
                                                    height={24}
                                                    src={heartFilled}
                                                    alt="Heart..."
                                                />
                                                :
                                                <Image
                                                    className="text-blue-500"
                                                    width={24}
                                                    height={24}
                                                    src={heart}
                                                    alt="Heart..."
                                                />
                                            }
                                        </div>
                                    </div>
                                    <div className="flex gap-1 items-center">
                                        {post.comments?.length}
                                        <Image
                                            width={24}
                                            height={24}
                                            src={commentBubble}
                                            alt="Comment Bubble..."
                                        />
                                    </div>
                                </div>
                                <div>
                                    <p className="font-medium">
                                        See More
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
        </div>
    )
}