"use client"

import Image from "next/image";
import Link from "next/link";
import { SessionUser } from "../types/SessionUser";
import commentBubble from "../images/CommentBubble.svg";
import heart from "../images/Heart.svg";
import heartFilled from "../images/Heart_Filled.svg";

type PostProps = {
    id: string,
    name: string,
    avatar: string,
    title: string,
    content: string,
    sessionUser?: SessionUser
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

export default function SideBarMyPost({ id, title, content, comments, likes, sessionUser }: PostProps) {
    const postLikedBySessionUser = likes.find((like) => like.userId === sessionUser?.id);

    return (
        <Link href={`/post/${id}`}>
            <div className="m-6 sm:ml-0">
                <div className="flex">
                    <p className="font-semibold text-md">
                        {title}
                    </p>
                </div>
                <div className="my-4">
                    <p className="break-normal"> {content.substring(0, 200)}... </p>
                </div>
                <div className="flex items-center justify-between pb-1">
                    <div className="flex gap-2 items-center">
                        <div className="flex gap-1 items-center">
                            {likes.length}
                            <div>
                                {postLikedBySessionUser ?
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
                            {comments?.length}
                            <Image
                                width={24}
                                height={24}
                                src={commentBubble}
                                alt="Comment Bubble..."
                            />
                        </div>
                    </div>
                    <div>
                        <p className="font-medium">
                            See More
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    )
}