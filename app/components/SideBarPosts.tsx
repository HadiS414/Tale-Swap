"use client"

import Image from "next/image";
import Link from "next/link";
import { SessionUser } from "../types/SessionUser";
import commentBubble from "../images/CommentBubble.svg";
import heart from "../images/Heart.svg";
import heartFilled from "../images/Heart_Filled.svg";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PostType } from "../types/Post";

type Props = {
    sessionUser?: SessionUser
}

const fetchAllPosts = async () => {
    const res = await axios.get("/api/posts/getPosts");
    return res.data;
}
const fetchGenrePosts = async (genre: string) => {
    const res = await axios.get(`/api/posts/getGenrePosts/${genre}`);
    return res.data;
}

export default function SideBarPosts({ sessionUser }: Props) {
    const queryClient = useQueryClient();
    queryClient.fetchQuery(["personalPosts"], () => fetchGenrePosts("Personal"));
    queryClient.fetchQuery(["miscPosts"], () => fetchGenrePosts("Misc"));
    const { data: personalPosts, isLoading } = useQuery<PostType[]>({
        queryFn: fetchAllPosts,
        queryKey: ["personalPosts"]
    });
    const { data: miscPosts, isLoading: miscLoading } = useQuery<PostType[]>({
        queryFn: fetchAllPosts,
        queryKey: ["miscPosts"]
    });
    if (isLoading) {
        return <h1> Loading... </h1>
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mt-2 ml-1 font-montserrat">
                Personal
            </h1>
            {personalPosts &&
                personalPosts?.slice(0, 2).map((post) => (
                    <Link href={`/post/${post.id}`}>
                        <div className="m-6 sm:ml-0">
                            <div className="flex gap-2 justify-between">
                                <p className="font-montserrat font-semibold text-md">
                                    {post.title}
                                </p>
                                <div className="flex items-center gap-1">
                                    <Image
                                        className="rounded-full"
                                        width={18}
                                        height={6}
                                        src={post.user.image}
                                        alt="Avatar..."
                                    />
                                    <p className="font-montserrat text-xs font-normal"> {post.user.name} </p>
                                </div>
                            </div>
                            <div className="my-4">
                                <p className="font-montserrat break-normal"> {post.content.substring(0, 200)}... </p>
                            </div>
                            <div className="flex items-center justify-between pb-1">
                                <div className="flex gap-2 items-center">
                                    <div className="flex gap-1 items-center">
                                        {post.likes.length}
                                        <div>
                                            {post.likes.find((like) => like.userId === sessionUser?.id) ?
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
                                        </div>
                                    </div>
                                    <div className="flex gap-1 items-center">
                                        {post.comments?.length}
                                        <Image
                                            width={24}
                                            height={24}
                                            src={commentBubble}
                                            alt="Comment Bubble..."
                                        />
                                    </div>
                                </div>
                                <div>
                                    <p className="font-montserrat font-medium">
                                        See More
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            <h1 className="text-2xl font-bold mt-2 ml-1 font-montserrat">
                Misc
            </h1>
            {miscPosts &&
                miscPosts?.slice(0, 1).map((post) => (
                    <Link href={`/post/${post.id}`}>
                        <div className="m-6 sm:ml-0">
                            <div className="flex gap-2 justify-between">
                                <p className="font-montserrat font-semibold text-md">
                                    {post.title}
                                </p>
                                <div className="flex items-center gap-1">
                                    <Image
                                        className="rounded-full"
                                        width={18}
                                        height={6}
                                        src={post.user.image}
                                        alt="Avatar..."
                                    />
                                    <p className="font-montserrat text-xs font-normal"> {post.user.name} </p>
                                </div>
                            </div>
                            <div className="my-4">
                                <p className="font-montserrat break-normal"> {post.content.substring(0, 200)}... </p>
                            </div>
                            <div className="flex items-center justify-between pb-1">
                                <div className="flex gap-2 items-center">
                                    <div className="flex gap-1 items-center">
                                        {post.likes.length}
                                        <div>
                                            {post.likes.find((like) => like.userId === sessionUser?.id) ?
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
                                        </div>
                                    </div>
                                    <div className="flex gap-1 items-center">
                                        {post.comments?.length}
                                        <Image
                                            width={24}
                                            height={24}
                                            src={commentBubble}
                                            alt="Comment Bubble..."
                                        />
                                    </div>
                                </div>
                                <div>
                                    <p className="font-montserrat font-medium">
                                        See More
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
        </div>
    )
}