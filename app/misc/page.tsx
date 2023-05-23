"use client"

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { PostType } from "../types/Post";
import Post from "../components/Post";

const fetchMiscPosts = async () => {
    const res = await axios.get("/api/posts/getGenrePosts/misc");
    return res.data;
}

export default function MiscPage() {
    const { data, isLoading } = useQuery<PostType[]>({
        queryFn: fetchMiscPosts,
        queryKey: ["genre-posts"]
    })
    if (isLoading) {
        return <h1> Loading... </h1>
    }

    return (
        <div>
            {data?.map((post) => (
                <Post
                    id={post.id}
                    name={post.user.name}
                    avatar={post.user.image}
                    content={post.content}
                    comments={post.comments}
                    likes={post.likes}
                    creatorId={post.user.id}
                />
            ))}
        </div>
    )
}