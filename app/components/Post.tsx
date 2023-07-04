"use client"

import { MessageOutlined, HeartFilled, HeartOutlined } from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { SessionUser } from "../types/SessionUser";
import { useState } from "react";
import saveButton from "../Vector.svg";

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
    const { data } = useQuery<SessionUser>({
        queryFn: fetchSessionUser,
        queryKey: ["sessionUser"]
    });
    const sessionUser = { ...data }

    const { mutate } = useMutation(
        async (type: string) => type === "like" ? await axios.post("/api/posts/likePost", { postId: id }) : await axios.post("/api/auth/followUser", { id: creatorId }),
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries(["posts"]);
                queryClient.invalidateQueries(["sessionUser"]);
                queryClient.invalidateQueries(["following-posts"]);
                queryClient.invalidateQueries(["genre-posts"]);
            },
            onError: (error) => {
                queryClient.invalidateQueries(["posts"]);
                queryClient.invalidateQueries(["sessionUser"]);
                queryClient.invalidateQueries(["following-posts"]);
                queryClient.invalidateQueries(["genre-posts"]);
            }
        }
    )

    const postLikedBySessionUser = likes.find((like) => like.userId === sessionUser.id);
    const userFollowedBySessionUser = sessionUser.following?.find((followedUser) => followedUser.followingId === creatorId);

    return (
        <div className="m-6 border-b border-black">
            <div className="flex items-center gap-2">
                <Image
                    width={24}
                    height={24}
                    src={saveButton}
                    alt="Bookmark..."
                />
                <p className="underline font-medium text-lg">
                    {title}
                </p>
                {/*
                {creatorId !== sessionUser.id &&
                    <button
                        className="bg-teal-600 text-white py-1 px-4 ml-2 rounded-md hover:bg-teal-500 active:bg-teal-300"
                        onClick={() => mutate("follow")}
                    >
                        {userFollowedBySessionUser ?
                            <p> Unfollow </p>
                            :
                            <p> Follow </p>
                        }
                    </button>
                } */}
            </div>
            <div>
                By: {name}
            </div>
            <div className="my-4">
                <p className="break-normal"> {seeMore ? content : content.substring(0, 400)} </p>
            </div>
            <div className="flex items-center justify-between pb-1">
                <div className="flex gap-2">
                    <div className="flex gap-1 items-center">
                        {likes.length}
                        <button onClick={() => mutate("like")}>
                            {postLikedBySessionUser ?
                                <HeartFilled className="text-blue-500 text-lg" />
                                :
                                <HeartOutlined className="text-blue-500 text-lg" />
                            }
                        </button>
                    </div>
                    <div className="flex gap-1 items-center">
                        {comments?.length}
                        <button>
                            <MessageOutlined className="text-blue-500 text-lg" />
                        </button>
                    </div>
                </div>
                <div>
                    {content.length > 400 &&
                        <button onClick={() => setSeeMore(!seeMore)}>
                            <p className="underline font-medium">
                                {seeMore ? "See Less" : "See More"}
                            </p>
                        </button>
                    }
                </div>
            </div>
        </div>
    )
}