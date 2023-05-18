"use client"

import AddComment from "@/app/components/AddComment";
import Post from "@/app/components/Post";
import { PostType } from "@/app/types/Post";
import { DeleteFilled } from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Modal } from "antd";
import axios from "axios";
import Image from "next/image";

type CommentModalProps = {
    showModal: boolean
    setShowModal: (isOpen: boolean) => void
    id: string,
    name: string,
    avatar: string,
    content: string,
    creatorId: string
    sessionUserId: string
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

export default function CommentModal({ showModal, setShowModal, id, name, avatar, content, comments, likes, creatorId, sessionUserId }: CommentModalProps) {
    const queryClient = useQueryClient();
    const { mutate } = useMutation(
        async (id: string) => await axios.delete(`/api/posts/deleteComment/${id}`),
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries(["posts"]);
                queryClient.invalidateQueries(["my-posts"]);
                queryClient.invalidateQueries(["following-posts"]);
            },
            onError: (error) => {
                queryClient.invalidateQueries(["posts"]);
                queryClient.invalidateQueries(["my-posts"]);
                queryClient.invalidateQueries(["following-posts"]);
            }
        }
    )

    const deleteComment = async (id: string) => {
        mutate(id);
    }

    return (
        <Modal
            open={showModal}
            onCancel={() => setShowModal(false)}
            closable={true}
            centered={true}
            width={800}
            okButtonProps={{ style: { color: "#FFFFFF", borderColor: "#FFFFFF" } }}
            cancelButtonProps={{ style: { color: "#FFFFFF", borderColor: "#FFFFFF" } }}
        >
            <div className="bg-gray-200">
                <Post
                    id={id}
                    name={name}
                    avatar={avatar}
                    content={content}
                    comments={comments}
                    likes={likes}
                    creatorId={creatorId}
                />
                <AddComment id={id} />
                {comments?.map((comment) => (
                    <div key={comment.id} className="m-8 bg-white p-8 rounded-md">
                        <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                                <Image
                                    className="rounded-full"
                                    width={24}
                                    height={24}
                                    src={comment.user.image}
                                    alt="Avatar..."
                                />
                                <h3 className="font-bold"> {comment?.user?.name} </h3>
                                <h2 className="text-sm"> {comment.createdAt.substring(0, 19)} </h2>
                            </div>
                            <div>
                                {(creatorId === sessionUserId || comment.userId === sessionUserId) &&
                                    <button onClick={() => deleteComment(comment.id)}>
                                        <DeleteFilled className="text-red-500 hover:text-red-400 active:text-red-300 text-xl cursor-pointer" />
                                    </button>
                                }
                            </div>
                        </div>
                        <div className="py-4">
                            {comment.content}
                        </div>
                    </div>
                ))}
            </div>
        </Modal>
    )
}