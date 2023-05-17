"use client"

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Post from "../components/Post";

const fetchFollowingPosts = async () => {
    const res = await axios.get("/api/posts/getFollowingPosts");
    return res.data;
}

export default function FollowingPage() {
    const { data, isLoading } = useQuery<any[]>({
        queryFn: fetchFollowingPosts,
        queryKey: ["following-posts"]
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