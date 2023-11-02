"use client"

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import DeletePostModal from "./DeletePostModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { CloseOutlined } from "@ant-design/icons";
import { SessionUser } from "../types/SessionUser";
import Link from "next/link";
import commentBubble from "../images/CommentBubble.svg";
import heart from "../images/Heart.svg";
import heartFilled from "../images/Heart_Filled.svg";

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
    const [showDeleteButton, setShowDeleteButton] = useState(false);
    const [showDeletePostModal, setShowDeletePostModal] = useState(false);
    const queryClient = useQueryClient();
    const { data } = useQuery<SessionUser>({
        queryFn: fetchSessionUser,
        queryKey: ["sessionUser"]
    });
    const sessionUser = { ...data };
    const deleteButtonRef = useRef<HTMLDivElement | null>(null);

    const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Node;
        if (deleteButtonRef.current && !deleteButtonRef.current.contains(target)) {
            setShowDeleteButton(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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
        <div className="m-6 border-b border-black font-montserrat">
            <div className="flex justify-between">
                <p className="font-semibold text-xl">
                    {title}
                </p>
                <div className="cursor-pointer">
                    {showDeleteButton ?
                        <div ref={deleteButtonRef}>
                            <button className="bg-red-500 rounded-full px-2 py-1 text-off-white font-thin" onClick={() => setShowDeletePostModal(true)}>
                                Delete
                            </button>
                        </div>
                        :
                        <CloseOutlined onClick={() => setShowDeleteButton(true)} />
                    }
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