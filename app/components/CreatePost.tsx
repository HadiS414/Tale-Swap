"use client"

import { useState } from "react";
import { message } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

export default function CreatePost() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isDisabled, setIsDisabled] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const queryClient = useQueryClient();

    const { mutate } = useMutation(
        async (content: string) => await axios.post("/api/posts/createPost", { content }),
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries(["posts"]);
                setContent("");
                setIsDisabled(false);
                messageApi.open({ type: "success", content: "Post has been made!", key: "createPost" })
            },
            onError: (error) => {
                queryClient.invalidateQueries(["posts"]);
                setIsDisabled(false);
                if (error instanceof AxiosError) {
                    messageApi.open({ type: "error", content: error?.response?.data.message, key: "createPost" })
                }
            }
        }
    )

    const submitPost = async (e: React.FormEvent) => {
        messageApi.open({ type: "loading", content: "Creating post...", key: "createPost" })
        e.preventDefault();
        setIsDisabled(true);
        mutate(content);
    }

    return (
        <>
            {contextHolder}
            <form onSubmit={submitPost} className="bg-white m-8 p-8 rounded-md">
                <div className="flex flex-col my-4">
                    <textarea
                        name="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Tell a tale..."
                        className="p-4 text-lg rounded-md my-2 bg-gray-200"
                    />
                </div>
                <div className="flex items-center justify-between gap-2">
                    <p className={`font-bold text-sm ${content.length <= 300 ? "text-gray-700" : "text-red-700"}`}>{`${content.length} / 300`}</p>
                    <button
                        disabled={isDisabled}
                        className="bg-teal-600 text-white font-medium py-2 px-6 rounded-xl hover:bg-teal-500 active:bg-teal-300 disabled:opacity-25"
                        type="submit"
                    >
                        Create a post
                    </button>
                </div>
            </form>
        </>
    )
}