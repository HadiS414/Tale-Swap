"use client"

import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { SessionUser } from "../types/SessionUser";
import { useState } from "react";
import saveButton from "../images/Vector.svg";
import commentBubble from "../images/CommentBubble.svg";
import heart from "../images/Heart.svg";

type PostProps = {
    id: string,
    name: string,
    avatar: string,
    title: string,
    content: string,
    creatorId: string
    likes: {
        id: string
        postId: string
        userId: string
    }[],
    comments: {
        id: string;
        createdAt: string;
        postId: string;
        userId: string;
        content: string;
        user: {
            id: string;
            name: string;
            email: string;
            image: string;
        };
    }[]
}

const fetchSessionUser = async () => {
    const res = await axios.get("/api/auth/getSessionUser");
    return res.data;
}

export default function Post({ id, name, avatar, title, content, comments, likes, creatorId }: PostProps) {
    const [seeMore, setSeeMore] = useState(false);
    const queryClient = useQueryClient();
    const { data: sessionUser } = useQuery<SessionUser>({
        queryFn: fetchSessionUser,
        queryKey: ["sessionUser"]
    });

    const { mutate } = useMutation(
        async (type: string) => type === "like" ? await axios.post("/api/posts/likePost", { postId: id }) : await axios.post("/api/auth/followUser", { id: creatorId }),
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

    const postLikedBySessionUser = likes.find((like) => like.userId === sessionUser?.id);

    return (
        <div className="m-6 border-b border-black">
            <div className="flex items-center gap-2">
                <Image
                    width={24}
                    height={24}
                    src={saveButton}
                    alt="Bookmark..."
                />
                <p className="font-semibold text-xl">
                    {title}
                </p>
            </div>
            <div>
                {sessionUser ?
                    <Link href={creatorId === sessionUser?.id ? '/profile' : `/profile/${creatorId}`}>
                        By: {name}
                    </Link>
                    :
                    <p> By: {name} </p>
                }
            </div>
            <div className="my-4">
                <p className="break-normal"> {seeMore ? content : content.substring(0, 400)} </p>
            </div>
            <div className="flex items-center justify-between pb-1">
                <div className="flex gap-2 items-center">
                    <div className="flex gap-1 items-center">
                        {likes.length}
                        <button onClick={() => mutate("like")} disabled={!sessionUser}>
                            {postLikedBySessionUser ?
                                <HeartFilled className="text-blue-500 text-2xl" />
                                :
                                // <HeartOutlined className="text-blue-500 text-2xl" />
                                <Image
                                    className="text-blue-500"
                                    width={24}
                                    height={24}
                                    src={heart}
                                    alt="Heart..."
                                />
                            }
                        </button>
                    </div>
                    <div className="flex gap-1 items-center">
                        {comments?.length}
                        {sessionUser ?
                            <Link href={`/post/${id}`}>
                                <Image
                                    width={24}
                                    height={24}
                                    src={commentBubble}
                                    alt="Comment Bubble..."
                                />
                            </Link>
                            :
                            <Image
                                width={24}
                                height={24}
                                src={commentBubble}
                                alt="Comment Bubble..."
                            />
                        }
                    </div>
                </div>
                <div>
                    {content.length > 400 &&
                        <button onClick={() => setSeeMore(!seeMore)}>
                            <p className="font-medium">
                                {seeMore ? "See Less" : "See More"}
                            </p>
                        </button>
                    }
                </div>
            </div>
        </div>
    )
}