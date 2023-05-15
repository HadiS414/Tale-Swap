"use client"

import Image from "next/image";
import { useState } from "react";
import DeletePostModal from "./DeletePostModal";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

type EditProps = {
    id: string
    avatar: string
    name: string
    title: string
    content: string
    comments?: {
        id: string
        postId: string
        userId: string
    }[]
}

export default function EditPost({ id, avatar, name, title, content, comments }: EditProps) {
    const [showModal, setShowModal] = useState(false);
    const [editedContent, setEditedContent] = useState(content);
    const queryClient = useQueryClient();

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

    const submitEditPost = async () => {
        mutate();
        console.log("asdsada")
    }

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
                <div className="flex gap-4">
                    <Link href={`/post/${id}`}>
                        <p className="text-sm font-bold text-gray-700"> {comments?.length} Comments </p>
                    </Link>
                    <button className="text-sm font-bold text-red-500" onClick={() => setShowModal(true)}>
                        Delete
                    </button>
                </div>
                <div>
                    <button
                        className="bg-teal-600 text-white font-medium py-2 px-6 rounded-xl hover:bg-teal-500 active:bg-teal-300 disabled:opacity-25"
                        onClick={() => submitEditPost()}
                    >
                        Edit post
                    </button>
                </div>
            </div>
            <DeletePostModal showModal={showModal} setShowModal={setShowModal} postId={id} />
        </div>
    )
}