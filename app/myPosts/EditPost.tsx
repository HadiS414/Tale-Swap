"use client"

import Image from "next/image";
import { useState } from "react";
import DeletePostModal from "./DeletePostModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { LikeFilled } from "@ant-design/icons";
import CommentModal from "../components/CommentModal";
import { SessionUser } from "../types/SessionUser";

type EditProps = {
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

export default function EditPost({ id, avatar, name, title, content, comments, likes }: EditProps) {
    const [showDeletePostModal, setShowDeletePostModal] = useState(false);
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [editedContent, setEditedContent] = useState(content);
    const queryClient = useQueryClient();
    const { data } = useQuery<SessionUser>({
        queryFn: fetchSessionUser,
        queryKey: ["sessionUser"]
    });
    const sessionUser = { ...data }

    const { mutate } = useMutation(
        async () => await axios.patch("/api/posts/editPost", { postId: id, content: editedContent }),
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries(["my-posts"]);
            },
            onError: (error) => {
                queryClient.invalidateQueries(["my-posts"]);
            }
        }
    )

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
            <div className="my-8 flex flex-col">
                <textarea
                    name="editedContent"
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    placeholder="Tell a tale..."
                    className="p-4 text-lg rounded-md my-2 bg-gray-200"
                />
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => setShowCommentModal(true)}>
                        <p className="text-sm font-bold text-gray-700 cursor-pointer"> {comments?.length} Comments </p>
                    </button>
                    <button className="text-sm font-bold text-red-500" onClick={() => setShowDeletePostModal(true)}>
                        Delete
                    </button>
                    <div className="flex gap-1">
                        <LikeFilled className="text-green-500 text-base" />
                        {likes.length}
                    </div>
                </div>
                <div>
                    <button
                        className="bg-teal-600 text-white font-medium py-2 px-6 rounded-xl hover:bg-teal-500 active:bg-teal-300 disabled:opacity-25"
                        onClick={() => mutate()}
                    >
                        Edit post
                    </button>
                </div>
            </div>
            <DeletePostModal
                showModal={showDeletePostModal}
                setShowModal={setShowDeletePostModal}
                postId={id}
            />
            <CommentModal
                showModal={showCommentModal}
                setShowModal={setShowCommentModal}
                id={id}
                name={name}
                avatar={avatar}
                content={content}
                comments={comments}
                likes={likes}
                creatorId={sessionUser.id as string}
                sessionUserId={sessionUser.id as string}
            />
        </div>
    )
}