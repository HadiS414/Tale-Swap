"use client"

import CreatePost from "../components/CreatePost"
import Post from "../components/Post";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { PostType } from "../types/Post";

type AllPostsProps = {
    sessionUserId?: string
}

const fetchPosts = async () => {
  const res = await axios.get("/api/posts/getPosts");
  return res.data;
}

export default function AllPosts({ sessionUserId }: AllPostsProps) {
  const { data, isLoading } = useQuery<PostType[]>({
    queryFn: fetchPosts,
    queryKey: ["posts"]
  })
  if (isLoading) {
    return <h1> Loading... </h1>
  }

  return (
    <div>
      <CreatePost />
      {data?.map((post) => (
        <Post
          id={post.id}
          name={post.user.name}
          avatar={post.user.image}
          content={post.content}
          comments={post.comments}
          likes={post.likes}
          sessionUserId={sessionUserId}
        />
      ))}
    </div>
  )
}
