"use client"

import { useState } from "react";
import { message } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

type GenreButton = {
    label: string;
    active: boolean;
    action: () => void;
}

export default function CreatePost() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [genre, setGenre] = useState("");
    const [genreSelect, setGenreSelect] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [isPersonalActive, setIsPersonalActive] = useState(false);
    const [isFunnyActive, setIsFunnyActive] = useState(false);
    const [isMiscActive, setIsMiscActive] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
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
                setGenreSelect(false);
                setIsPersonalActive(false);
                setIsFunnyActive(false);
                setIsMiscActive(false);
                setShowEdit(false);
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
            <div className="bg-white rounded-md">
                {!showEdit ?
                    <div className="flex flex-col relative mt-4 mb-8 cursor-pointer transition-opacity duration-300 hover:opacity-40" onClick={() => setShowEdit(true)}>
                        <div className="w-full h-12 px-3 py-2 text-lg text-black font-light font-montserrat rounded-full border-black border-2">
                            Write a Post
                        </div>
                        <div className="font-montserrat flex absolute right-2 top-1 items-center bg-gray-200 px-4 py-2 rounded-full">
                            Post
                        </div>
                    </div>
                    :
                    <div className="flex flex-col relative mt-4 mb-8">
                        <div className="font-montserrat w-full px-3 py-2 text-lg text-black rounded-3xl border-black border">
                            <input
                                placeholder="Title"
                                className="text-xl w-4/6 font-medium outline-none"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <textarea
                                placeholder="Enter your story here..."
                                className="text-lg my-4 w-full outline-none"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                rows={3}
                            />
                            {!genre ?
                                <button
                                    className={`px-4 py-2 rounded-full my-1 w-20 items-center ${title && content ? "cursor-pointer bg-blue-500 text-off-white" : "bg-gray-200 "}`}
                                    disabled={!title || !content}
                                    onClick={() => setGenreSelect(true)}
                                >
                                    Next
                                </button>
                                :
                                <button
                                    className={`px-4 py-2 rounded-full my-1 w-20 items-center cursor-pointer bg-blue-500 hover:bg-blue-600 text-off-white`}
                                    disabled={!title || !content || isDisabled}
                                    onClick={submitPost}
                                >
                                    Post
                                </button>
                            }
                        </div>
                        {genreSelect &&
                            <div className="font-montserrat flex items-center gap-2 w-full px-3 py-2 mt-2 text-lg text-black rounded-2xl border-black border">
                                Select Genre:
                                {buttons.map((button, index) => (
                                    <button
                                        key={index}
                                        className={`rounded-full px-3 py-[1px] border border-black ${button.active ? "bg-dark-orange text-off-white" : "bg-off-white"}`}
                                        onClick={button.action}
                                    >
                                        {button.label}
                                    </button>

                                ))}
                            </div>
                        }
                    </div>
                }
            </div>
        </>
    )
}