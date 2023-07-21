"use client"

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { message } from "antd";
import { SessionUser } from "../types/SessionUser";
import Image from "next/image";
import { RightCircleOutlined } from "@ant-design/icons";

type PostProps = {
    id?: string
}

type Comment = {
    postId?: string
    content: string
}

const fetchSessionUser = async () => {
    const res = await axios.get("/api/auth/getSessionUser");
    return res.data;
}

export default function AddComment({ id }: PostProps) {
    const [content, setContent] = useState("");
    const [isDisabled, setIsDisabled] = useState(false);
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();
    const { data } = useQuery<SessionUser>({
        queryFn: fetchSessionUser,
        queryKey: ["sessionUser"]
    });
    const sessionUser = { ...data }

    const { mutate } = useMutation(
        async (data: Comment) => axios.post("/api/posts/addComment", { data }),
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries(["posts"]);
                queryClient.invalidateQueries(["detail-post"]);
                setIsDisabled(false);
                setContent("");
                messageApi.open({ type: "success", content: "Comment has been added!", key: "addComment" })
            },
            onError: (error) => {
                queryClient.invalidateQueries(["posts"]);
                queryClient.invalidateQueries(["detail-post"]);
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
            <form className="mx-6 my-2 border-b-2" onSubmit={submitComment}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Image
                            className="rounded-full"
                            width={32}
                            height={32}
                            src={sessionUser.image || ""}
                            alt="Avatar..."
                        />
                        <input
                            onChange={(e) => setContent(e.target.value)}
                            value={content}
                            type="text"
                            placeholder="Comment"
                        />
                    </div>
                    <div>
                        <button
                            disabled={isDisabled}
                            type="submit"
                            className="flex justify-end"
                        >
                            <RightCircleOutlined className="text-3xl" />
                        </button>
                    </div>
                </div>
            </form>
        </>
    )
}