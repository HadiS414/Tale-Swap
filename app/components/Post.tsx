"use client"

import { LikeFilled, LikeOutlined } from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { SessionUser } from "../types/SessionUser";
import { useState } from "react";
import CommentModal from "./CommentModal";

type PostProps = {
    id: string,
    name: string,
    avatar: string,
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

export default function Post({ id, name, avatar, content, comments, likes, creatorId }: PostProps) {
    const [showModal, setShowModal] = useState(false);
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
        <div className="bg-white m-8 p-8 rounded-lg">
            <div className="flex items-center gap-2">
                <Image
                    className="rounded-full"
                    width={32}
                    height={32}
                    src={avatar}
                    alt="Avatar..."
                />
                <h3 className="font-bold text-gray-700"> {name} </h3>
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
                }
            </div>
            <div className="my-8">
                <p className="break-all"> {content} </p>
            </div>
            <div className="flex gap-4 items-center">
                <button onClick={() => setShowModal(true)}>
                    <p className="text-sm font-bold text-gray-700 cursor-pointer"> {comments?.length} Comments </p>
                </button>
                <div className="flex gap-1">
                    <button onClick={() => mutate("like")}>
                        {postLikedBySessionUser ?
                            <LikeFilled className="text-green-500 text-lg" />
                            :
                            <LikeOutlined className="text-green-500 text-lg" />
                        }
                    </button>
                    {likes.length}
                </div>
            </div>
            <CommentModal
                showModal={showModal}
                setShowModal={setShowModal}
                id={id}
                name={name}
                avatar={avatar}
                content={content}
                comments={comments}
                likes={likes}
                creatorId={creatorId}
                sessionUserId={sessionUser.id as string}
            />
        </div>
    )
}