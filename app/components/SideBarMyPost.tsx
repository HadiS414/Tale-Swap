"use client"

import Image from "next/image";
import Link from "next/link";
import { SessionUser } from "../types/SessionUser";
import commentBubble from "../images/CommentBubble.svg";
import heart from "../images/Heart.svg";
import heartFilled from "../images/Heart_Filled.svg";

type Props = {
    sessionUser?: SessionUser
}

export default function SideBarMyPost({ sessionUser }: Props) {
    const myPost = sessionUser?.posts[0];
    const postLikedBySessionUser = myPost?.likes.find((like) => like.userId === sessionUser?.id);

    return (
        <Link href={`/post/${myPost?.id}`}>
            <div className="m-6 sm:ml-0">
                <div className="flex">
                    <p className="font-semibold text-md">
                        {myPost?.title}
                    </p>
                </div>
                <div className="my-4">
                    <p className="break-normal"> {myPost?.content.substring(0, 200)}... </p>
                </div>
                <div className="flex items-center justify-between pb-1">
                    <div className="flex gap-2 items-center">
                        <div className="flex gap-1 items-center">
                            {myPost?.likes.length}
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
                            {myPost?.comments?.length}
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