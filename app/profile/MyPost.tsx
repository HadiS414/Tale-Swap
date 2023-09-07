"use client"

import Image from "next/image";
import { useState } from "react";
import DeletePostModal from "./DeletePostModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { HeartFilled, CloseOutlined } from "@ant-design/icons";
import { SessionUser } from "../types/SessionUser";
import Link from "next/link";
import commentBubble from "../images/CommentBubble.svg";
import heart from "../images/Heart.svg";

type MyPostProps = {
    id: string
    avatar: string
    name: string
    title: string
    content: string
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
        }
    }[]
    likes: {
        id: string
        postId: string
        userId: string
    }[]
}

const fetchSessionUser = async () => {
    const res = await axios.get("/api/auth/getSessionUser");
    return res.data;
}

export default function MyPost({ id, name, title, content, comments, likes }: MyPostProps) {
    const [seeMore, setSeeMore] = useState(false);
    const [showDeletePostModal, setShowDeletePostModal] = useState(false);
    const queryClient = useQueryClient();
    const { data } = useQuery<SessionUser>({
        queryFn: fetchSessionUser,
        queryKey: ["sessionUser"]
    });
    const sessionUser = { ...data }

    const { mutate } = useMutation(
        async () => await axios.post("/api/posts/likePost", { postId: id }),
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries(["sessionUser"]);
            },
            onError: (error) => {
                queryClient.invalidateQueries(["sessionUser"]);
            }
        }
    )

    const postLikedBySessionUser = likes.find((like) => like.userId === sessionUser.id);

    return (
        <div className="m-6 border-b border-black">
            <div className="flex justify-between">
                <p className="font-semibold text-xl">
                    {title}
                </p>
                <div className="cursor-pointer" onClick={() => setShowDeletePostModal(true)}>
                    <CloseOutlined />
                </div>
            </div>
            <div className="my-4">
                <p className="break-normal"> {seeMore ? content : content.substring(0, 400)} </p>
            </div>
            <div className="flex items-center justify-between pb-1">
                <div className="flex gap-2 items-center">
                    <div className="flex gap-1 items-center">
                        {likes.length}
                        <button onClick={() => mutate()}>
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
                        <Link href={`/post/${id}`}>
                            <Image
                                width={24}
                                height={24}
                                src={commentBubble}
                                alt="Comment Bubble..."
                            />
                        </Link>
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
            <DeletePostModal
                showModal={showDeletePostModal}
                setShowModal={setShowDeletePostModal}
                postId={id}
            />
        </div>
    )
}