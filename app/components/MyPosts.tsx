"use client"

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { MyPostsType } from "../types/MyPosts";
import EditPost from "./EditPost";

const fetchMyPosts = async () => {
    const response = await axios.get("api/posts/getMyPosts");
    return response.data;
}

export default function MyPosts() {
    const { data, isLoading } = useQuery<MyPostsType>({
        queryFn: fetchMyPosts,
        queryKey: ["my-posts"]
    })
    if (isLoading) return <h1> Loading... </h1>

    return (
        <div>
            {data?.posts?.map((post) => (
                <EditPost
                    id={post.id}
                    avatar={data.image}
                    name={data.name}
                    title={post.title}
                    content={post.content}
                    comments={post.comments}
                    likes={post.likes}
                />
            ))}
        </div>
    )
}