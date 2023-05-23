"use client"

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { message } from "antd";

type PostProps = {
    id?: string
}

type Comment = {
    postId?: string
    content: string
}

export default function AddComment({ id }: PostProps) {
    const [content, setContent] = useState("");
    const [isDisabled, setIsDisabled] = useState(false);
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();

    const { mutate } = useMutation(
        async (data: Comment) => axios.post("/api/posts/addComment", { data }),
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries(["posts"]);
                queryClient.invalidateQueries(["my-posts"]);
                queryClient.invalidateQueries(["following-posts"]);
                queryClient.invalidateQueries(["genre-posts"]);
                setIsDisabled(false);
                setContent("");
                messageApi.open({ type: "success", content: "Comment has been added!", key: "addComment" })
            },
            onError: (error) => {
                queryClient.invalidateQueries(["posts"]);
                queryClient.invalidateQueries(["my-posts"]);
                queryClient.invalidateQueries(["following-posts"]);
                queryClient.invalidateQueries(["genre-posts"]);
                setIsDisabled(false);
                if (error instanceof AxiosError) {
                    messageApi.open({ type: "error", content: error?.response?.data.message, key: "addComment" })
                }
            }
        }
    )

    const submitComment = async (e: React.FormEvent) => {
        messageApi.open({ type: "loading", content: "Adding comment...", key: "addComment" });
        e.preventDefault();
        setIsDisabled(true);
        mutate({ content, postId: id });
    }

    return (
        <>
            {contextHolder}
            <form className="m-8" onSubmit={submitComment}>
                <div className="flex flex-col my-2">
                    <input
                        onChange={(e) => setContent(e.target.value)}
                        value={content}
                        type="text"
                        name="content"
                        className="p-4 rounded-md my-2"
                    />
                </div>
                <div className="flex justify-between items-center">
                    <p className={`font-bold text-sm ${content.length <= 300 ? "text-gray-700" : "text-red-700"}`}> {`${content.length} / 300`} </p>
                    <button
                        disabled={isDisabled}
                        className="bg-teal-600 text-white font-medium py-2 px-6 rounded-xl hover:bg-teal-500 active:bg-teal-300 disabled:opacity-25"
                        type="submit"
                    >
                        Add Comment
                    </button>
                </div>
            </form>
        </>
    )
}