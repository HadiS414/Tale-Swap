"use client"

import Image from "next/image";
import { useState } from "react";
import DeletePostModal from "./DeletePostModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { EllipsisOutlined } from "@ant-design/icons";
import { SessionUser } from "../types/SessionUser";
import Link from "next/link";
import commentBubble from "../images/CommentBubble.svg";
import heart from "../images/Heart.svg";
import heartFilled from "../images/Heart_Filled.svg";
import { Dropdown } from "antd";
import type { MenuProps } from 'antd';

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
    const sessionUser = { ...data };

    const items: MenuProps['items'] = [
        {
            key: '1',
            onClick: () => setShowDeletePostModal(true),
            label: (
                <p className="text-red-600 font-medium">
                    Delete
                </p>
            ),
        },
    ];

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
        <div className="m-6 font-montserrat">
            <div className="flex justify-between">
                <p className="font-semibold text-xl">
                    {title}
                </p>
                <div className="cursor-pointer">
                    <Dropdown menu={{ items }}>
                        <EllipsisOutlined className="flex text-2xl" />
                    </Dropdown>
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