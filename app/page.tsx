"use client"

import CreatePost from "./components/CreatePost"
import Post from "./components/Post";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PostType } from "./types/Post";
import Image from "next/image";
import pencil from "./images/Pencil.svg"
import Link from "next/link";
import ScrollingButtonGroup from "./components/ScrollingButtonGroup";

type ScrollingButton = {
  label: string;
  action: () => void;
}

export default function Home() {
  const queryClient = useQueryClient();
  const fetchAllPosts = async () => {
    const res = await axios.get("/api/posts/getPosts");
    return res.data;
  }
  const fetchFollowingPosts = async () => {
    const res = await axios.get("/api/posts/getFollowingPosts");
    return res.data;
  }
  const fetchGenrePosts = async (genre: string) => {
    const res = await axios.get(`/api/posts/getGenrePosts/${genre}`);
    return res.data;
  }

  const { data, isLoading } = useQuery<PostType[]>({
    queryFn: fetchAllPosts,
    queryKey: ["posts"]
  })
  if (isLoading) {
    return <h1> Loading... </h1>
  }

  const buttons: ScrollingButton[] = [
    {
      label: "Following",
      action: () => {
        queryClient.fetchQuery(["posts"], fetchFollowingPosts);
      }
    },
    {
      label: "Personal",
      action: () => {
        queryClient.fetchQuery(["posts"], () => fetchGenrePosts("Personal"));
      }
    },
    {
      label: "Funny",
      action: () => {
        queryClient.fetchQuery(["posts"], () => fetchGenrePosts("Funny"));
      }
    },
    {
      label: "Misc",
      action: () => {
        queryClient.fetchQuery(["posts"], () => fetchGenrePosts("Misc"));
      }
    },
  ]

  return (
    <div>
      <div className="bg-dark-orange">
        <h1 className="text-2xl font-bold font-verdana text-off-white p-3 ml-4" onClick={() => queryClient.fetchQuery(["posts"], fetchAllPosts)}>
          HOME
        </h1>
      </div>
      <div className="flex sm:hidden">
        {/* <button
          className="rounded-full text-off-white px-3 py-[2px] ml-4 mt-3 border border-black bg-blue-500">
          Following
        </button> */}
        <ScrollingButtonGroup buttons={buttons} />
      </div>
      <div className="hidden sm:block">
        <CreatePost />
      </div>
      {data?.map((post) => (
        <Post
          id={post.id}
          name={post.user.name}
          avatar={post.user.image}
          title={post.title}
          content={post.content}
          comments={post.comments}
          likes={post.likes}
          creatorId={post.user.id}
        />
      ))}
      <Link
        href={'/createPost'}
        className="fixed sm:hidden bottom-10 right-6 bg-dark-orange rounded-full p-4"
      >
        <Image
          width={32}
          height={32}
          src={pencil}
          alt="Pencil..."
        />
      </Link>
    </div>
  )
}
