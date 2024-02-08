"use client"

import { message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { SessionUser } from "../types/SessionUser";

const fetchSessionUser = async () => {
    const res = await axios.get("/api/auth/getSessionUser");
    return res.data;
}


export default function CreatePostPage() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [genre, setGenre] = useState("");
    const [displayGenres, setDisplayGenres] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();
    const { data: sessionUser, isLoading } = useQuery<SessionUser>({
        queryFn: fetchSessionUser,
        queryKey: ["sessionUser"]
    });
    if (!sessionUser) {
        router.push("/");
    };

    const { mutate } = useMutation(
        async () => await axios.post("/api/posts/createPost", { content: content, genre: genre, title: title }),
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries(["posts"]);
                setContent("");
                setGenre("");
                setIsDisabled(false);
                router.push("/");
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
        mutate();
    }

    return (
        <>
            {contextHolder}
            {displayGenres ?
                <>
                    <div className="bg-dark-orange flex gap-1">
                        <button onClick={() => setDisplayGenres(false)}>
                            <ArrowLeftOutlined className="ml-2 text-2xl text-off-white" />
                        </button>
                        <h1 className="text-2xl font-bold font-verdana text-off-white p-3">
                            CHOOSE A GENRE
                        </h1>
                    </div>
                    <div className="font-montserrat text-center text-2xl font-bold my-8">
                        What Genre Is Your Story?
                    </div>
                    <div
                        className="font-montserrat mt-8 mx-6 rounded-3xl py-8 p-2 text-2xl bg-dark-orange text-center text-off-white border border-black"
                        onClick={() => {
                            setGenre("Personal");
                            setDisplayGenres(false);
                        }}>
                        Personal
                    </div>
                    <div className="font-montserrat mt-1 mx-6 rounded-3xl py-8 p-2 text-2xl bg-blue-500 text-center text-off-white border border-black"
                        onClick={() => {
                            setGenre("Funny");
                            setDisplayGenres(false);
                        }}>
                        Funny
                    </div>
                    <div className="font-montserrat mt-1 mx-6 rounded-3xl py-8 p-2 text-2xl bg-off-white text-center text-black border border-black"
                        onClick={() => {
                            setGenre("Misc");
                            setDisplayGenres(false);
                        }}>
                        Misc
                    </div>
                </>
                :
                <>
                    <div className="bg-dark-orange flex gap-1">
                        <button onClick={() => router.back()}>
                            <ArrowLeftOutlined className="ml-2 text-2xl text-off-white" />
                        </button>
                        <h1 className="text-2xl font-bold font-verdana text-off-white p-3">
                            POST A STORY
                        </h1>
                    </div>
                    {genre &&
                        <div>
                            <button className="font-montserrat rounded-full text-off-white px-3 py-1 ml-4 mt-4 border border-black bg-dark-orange">
                                {genre}
                            </button>
                        </div>
                    }
                    <div className="flex justify-between my-4 ml-6">
                        <input
                            placeholder="Title"
                            className="text-2xl w-4/6 font-montserrat outline-none"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        {genre ?
                            <button
                                onClick={submitPost}
                                disabled={isDisabled}
                                className="font-montserrat rounded-full text-off-white px-3 py-1 mr-4 border border-black bg-blue-500"
                            >
                                Post
                            </button>
                            :
                            <button
                                disabled={!content || !title}
                                onClick={() => setDisplayGenres(true)}
                                className={`font-montserrat rounded-full text-off-white px-3 py-1 mr-4 border border-black ${content && title ? "bg-blue-500" : "bg-gray-300"}`}
                            >
                                Next
                            </button>
                        }
                    </div>
                    <textarea
                        placeholder="Enter your story here..."
                        className="text-xl mx-6 my-4 w-96 font-montserrat outline-none"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={20}
                    />
                </>
            }
        </>
    )
}