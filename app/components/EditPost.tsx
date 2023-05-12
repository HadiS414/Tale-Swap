"use client"

import Image from "next/image";
import { useState } from "react";
import DeletePostModal from "./DeletePostModal";

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
            <div className="my-8">
                <p className="break-all"> {content} </p>
            </div>
            <div className="flex gap-4 items-center">
                <p className="text-sm font-bold text-gray-700"> {comments?.length} Comments </p>
                <button className="text-sm font-bold text-red-500" onClick={() => setShowModal(true)}>
                    Delete
                </button>
            </div>
            <DeletePostModal showModal={showModal} setShowModal={setShowModal} postId={id} />
        </div>
    )
}