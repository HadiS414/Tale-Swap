"use client"

import Image from "next/image";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { SessionUser } from "../types/SessionUser";
import { useState } from "react";
import saveButton from "../images/Save.svg";
import saveButtonFilled from "../images/Save_Filled.svg";
import commentBubble from "../images/CommentBubble.svg";
import heart from "../images/Heart.svg";
import heartFilled from "../images/Heart_Filled.svg";

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
        async (type: string) => type === "like" ? await axios.post("/api/posts/likePost", { postId: id }) : await axios.post("/api/posts/savePost", { postId: id }),
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
    const postSavedByUser = sessionUser?.savedPosts?.find((post) => post.post.id === id);

    return (
        <div className="m-6 border-b border-black sm:ml-0">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button onClick={() => mutate("save")} disabled={!sessionUser}>
                        {postSavedByUser ?
                            <Image
                                width={24}
                                height={24}
                                src={saveButtonFilled}
                                alt="Bookmark..."
                            />
                            :
                            <Image
                                width={24}
                                height={24}
                                src={saveButton}
                                alt="Bookmark..."
                            />
                        }
                    </button>
                    <p className="font-semibold font-montserrat text-xl">
                        {title}
                    </p>
                </div>
                <div className="hidden sm:block">
                    {sessionUser ?
                        <Link href={creatorId === sessionUser?.id ? '/profile' : `/profile/${creatorId}`} className="flex items-center gap-1">
                            <Image
                                className="rounded-full"
                                width={18}
                                height={6}
                                src={avatar}
                                alt="Avatar..."
                            />
                            <p className="font-montserrat text-xs font-normal"> {name} </p>
                        </Link>
                        :
                        <div className="flex items-center gap-1">
                            <Image
                                className="rounded-full"
                                width={18}
                                height={6}
                                src={avatar}
                                alt="Avatar..."
                            />
                            <p className="font-montserrat text-xs font-normal"> {name} </p>
                        </div>
                    }
                </div>
            </div>
            <div className="sm:hidden">
                {sessionUser ?
                    <Link href={creatorId === sessionUser?.id ? '/profile' : `/profile/${creatorId}`}>
                        <p className="font-montserrat">
                            By: {name}
                        </p>
                    </Link>
                    :
                    <p className="font-montserrat"> By: {name} </p>
                }
            </div>
            <div className="my-4">
                <p className="font-montserrat break-normal hidden sm:block"> {seeMore ? content : content.substring(0, 450)} </p>
                <p className="font-montserrat break-normal sm:hidden"> {seeMore ? content : content.substring(0, 250)} </p>
            </div>
            <div className="flex items-center justify-between pb-1">
                <div className="flex gap-2 items-center">
                    <div className="flex gap-1 items-center">
                        {likes.length}
                        <button onClick={() => mutate("like")} disabled={!sessionUser}>
                            {postLikedBySessionUser ?
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
                            <p className="font-montserrat font-medium">
                                {seeMore ? "See Less" : "See More"}
                            </p>
                        </button>
                    }
                </div>
            </div>
        </div>
    )
}