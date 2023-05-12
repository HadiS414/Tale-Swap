"use client"

import AddComment from "@/app/components/AddComment";
import Post from "@/app/components/Post";
import { PostType } from "@/app/types/Post";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";

type URL = {
    params: {
        slug: string
    }
}

const fetchPostDetails = async (slug: string) => {
    const response = await axios.get(`/api/posts/${slug}`);
    return response.data;
}

export default function PostDetails(url: URL) {
    const { data, isLoading } = useQuery<PostType>({
        queryFn: () => fetchPostDetails(url.params.slug),
        queryKey: ["detail-post"]
    })
    if (isLoading) {
        return "Loading...";
    }

    return (
        <div>
            {data &&
                <Post
                    id={data.id}
                    name={data.user.name}
                    avatar={data.user.image}
                    content={data.content}
                    comments={data.comments}
                />
            }
            <AddComment id={data?.id} />
            {data?.comments?.map((comment) => (
                <div key={comment.id} className="m-8 bg-white p-8 rounded-md">
                    <div className="flex items-center gap-2">
                        <Image
                            className="rounded-full"
                            width={24}
                            height={24}
                            src={comment.user?.image}
                            alt="Avatar..."
                        />
                        <h3 className="font-bold"> {comment?.user?.name} </h3>
                        <h2 className="text-sm"> {comment.createdAt} </h2>
                    </div>
                    <div className="py-4">
                        {comment.content}
                    </div>
                </div>
            ))}
        </div>
    )
}