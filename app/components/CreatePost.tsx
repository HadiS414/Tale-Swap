"use client"

import { useState } from "react";
import { message } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { SessionUser } from "../types/SessionUser";
import Image from "next/image";

type GenreButton = {
    label: string;
    active: boolean;
    action: () => void;
}

type Props = {
    sessionUser?: SessionUser
}

export default function CreatePost({ sessionUser }: Props) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [genre, setGenre] = useState("");
    const [isDisabled, setIsDisabled] = useState(false);
    const [isPersonalActive, setIsPersonalActive] = useState(false);
    const [isFunnyActive, setIsFunnyActive] = useState(false);
    const [isMiscActive, setIsMiscActive] = useState(false);
    const [showTitle, setShowTitle] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const queryClient = useQueryClient();

    const { mutate } = useMutation(
        async () => await axios.post("/api/posts/createPost", { content: content, genre: genre, title: title }),
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries(["posts"]);
                queryClient.invalidateQueries(["my-posts"]);
                setTitle("");
                setContent("");
                setGenre("");
                setIsPersonalActive(false);
                setIsFunnyActive(false);
                setIsMiscActive(false);
                setShowTitle(false);
                setIsDisabled(false);
                messageApi.open({ type: "success", content: "Post has been made!", key: "createPost" })
            },
            onError: (error) => {
                queryClient.invalidateQueries(["posts"]);
                queryClient.invalidateQueries(["my-posts"]);
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
        mutate();
    }

    const buttons: GenreButton[] = [
        {
            label: "Personal",
            active: isPersonalActive,
            action: () => {
                setGenre("Personal");
                setIsPersonalActive(true);
                setIsFunnyActive(false);
                setIsMiscActive(false);
            }
        },
        {
            label: "Funny",
            active: isFunnyActive,
            action: () => {
                setGenre("Funny");
                setIsPersonalActive(false);
                setIsFunnyActive(true);
                setIsMiscActive(false);
            }
        },
        {
            label: "Misc",
            active: isMiscActive,
            action: () => {
                setGenre("Misc");
                setIsPersonalActive(false);
                setIsFunnyActive(false);
                setIsMiscActive(true);
            }
        },
    ]

    return (
        <>
            {contextHolder}
            <div className="bg-off-white rounded-md">
                <>
                    <div className={`${!showTitle && "flex gap-2"} mt-6 w-full`}>
                        <div className={`${showTitle && "flex gap-2"}`}>
                            <Image
                                className="rounded-full"
                                width={32}
                                height={32}
                                src={sessionUser ? sessionUser.image : ""}
                                alt="Avatar..."
                            />
                            {showTitle &&
                                <input
                                    placeholder="Title"
                                    className="text-xl w-4/6 font-semibold outline-none font-montserrat"
                                    value={title}
                                    onChange={(e) => {
                                        setTitle(e.target.value)
                                        if (!e.target.value && !content) {
                                            setShowTitle(false);
                                            setGenre("");
                                            setIsPersonalActive(false);
                                            setIsFunnyActive(false);
                                            setIsMiscActive(false);
                                        }
                                    }}
                                />
                            }
                        </div>
                        <textarea
                            placeholder="What's your story?"
                            className={`text-lg outline-none w-11/12 font-light font-montserrat ${showTitle ? "ml-10" : "mb-10"}`}
                            value={content}
                            onChange={(e) => {
                                setContent(e.target.value);
                                if (e.target.value) {
                                    setShowTitle(true)
                                } else if (!e.target.value && !title) {
                                    setShowTitle(false);
                                    setGenre("");
                                    setIsPersonalActive(false);
                                    setIsFunnyActive(false);
                                    setIsMiscActive(false);
                                }
                            }}
                            rows={showTitle ? 3 : 1}
                        />
                    </div>
                    {title &&
                        <div className="font-montserrat flex items-center gap-2 w-full mb-3 text-lg text-black">
                            {buttons.map((button, index) => (
                                <button
                                    key={index}
                                    className={`rounded-full px-3 py-[1px] border border-black ${button.active ? "bg-blue-500 text-off-white" : "bg-off-white"}`}
                                    onClick={button.action}
                                >
                                    {button.label}
                                </button>

                            ))}
                        </div>
                    }
                    {showTitle &&
                        <button
                            className={`px-4 py-2 rounded-full my-1 w-20 items-centera font-montserrat ${title && content && genre ? "cursor-pointer bg-blue-500 text-off-white" : "bg-gray-200 "}`}
                            disabled={!title || !content || !genre || isDisabled}
                            onClick={submitPost}
                        >
                            Post
                        </button>
                    }
                </>

            </div>
        </>
    )
}