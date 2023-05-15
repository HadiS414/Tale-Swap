"use client"

import AddComment from "@/app/components/AddComment";
import Post from "@/app/components/Post";
import { PostType } from "@/app/types/Post";
import { DeleteFilled } from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
    const queryClient = useQueryClient();
    const { data, isLoading } = useQuery<PostType>({
        queryFn: () => fetchPostDetails(url.params.slug),
        queryKey: ["detail-post"]
    })

    const { mutate } = useMutation(
        async (id: string) => await axios.delete(`/api/posts/deleteComment/${id}`),
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries(["detail-post"]);
            },
            onError: (error) => {
                queryClient.invalidateQueries(["detail-post"]);
            }
        }
    )

    const deleteComment = async (id: string) => {
        mutate(id);
    }

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
                    <div className="flex items-center justify-between">
                        <div className="flex gap-2">
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
                        <div>
                            <button onClick={() => deleteComment(comment.id)}>
                                <DeleteFilled className="text-red-500 hover:text-red-400 active:text-red-300 text-xl cursor-pointer" />
                            </button>
                        </div>
                    </div>
                    <div className="py-4">
                        {comment.content}
                    </div>
                </div>
            ))}
        </div>
    )
}