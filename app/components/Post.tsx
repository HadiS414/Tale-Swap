"use client"

import { LikeFilled, LikeOutlined } from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

type PostProps = {
    id: string,
    name: string,
    avatar: string,
    content: string,
    sessionUserId?: string,
    likes: {
        id: string
        postId: string
        userId: string
    }[],
    comments?: {
        id: string
        createdAt: string
        postId: string
        userId: string
    }[]
}

export default function Post({ id, name, avatar, content, comments, likes, sessionUserId }: PostProps) {
    const queryClient = useQueryClient();
    const { mutate } = useMutation(
        async () => await axios.post("/api/posts/likePost", { postId: id }),
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries(["posts"]);
            },
            onError: (error) => {
                queryClient.invalidateQueries(["posts"]);
            }
        }
    )

    const like = likes.find((like) => like.userId === sessionUserId);

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
            </div>
            <div className="my-8">
                <p className="break-all"> {content} </p>
            </div>
            <div className="flex gap-4 items-center">
                <Link href={`/post/${id}`}>
                    <p className="text-sm font-bold text-gray-700 cursor-pointer"> {comments?.length} Comments </p>
                </Link>
                <div className="flex gap-1">
                    <button onClick={() => mutate()}>
                        {like ?
                            <LikeFilled className="text-green-500 text-lg" />
                            :
                            <LikeOutlined className="text-green-500 text-lg" />
                        }
                    </button>
                    {likes.length}
                </div>
            </div>
        </div>
    )
}