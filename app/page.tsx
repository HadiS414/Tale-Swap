"use client"

import CreatePost from "./components/CreatePost"
import Post from "./components/Post";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PostType } from "./types/Post";
import Image from "next/image";
import pencil from "./images/Pencil.svg"
import Link from "next/link";
import ScrollingNewCreators from "./components/ScrollingNewCreators";
import { SessionUser } from "./types/SessionUser";

type ScrollingFilterButton = {
  label: string;
  action: () => void;
}

const fetchSessionUser = async () => {
  const res = await axios.get("/api/auth/getSessionUser");
  return res.data;
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

  const { data: sessionUser } = useQuery<SessionUser>({
    queryFn: fetchSessionUser,
    queryKey: ["sessionUser"]
  });
  const { data, isLoading } = useQuery<PostType[]>({
    queryFn: fetchAllPosts,
    queryKey: ["posts"]
  })
  if (isLoading) {
    return <h1> Loading... </h1>
  }

  const buttons: ScrollingFilterButton[] = [
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
      {sessionUser &&
        <div className="flex sm:hidden">
          <div className="flex overflow-x-auto no-scrollbar">
            {buttons.map((button, index) => (
              <button
                key={index}
                className="rounded-full text-off-white px-3 py-[2px] ml-2 mt-3 border border-black bg-blue-500"
                onClick={button.action}
              >
                {button.label}
              </button>
            ))}
          </div>
        </div>
      }
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
      {sessionUser &&
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
      }
      <ScrollingNewCreators sessionUser={sessionUser} />
      <div className="mt-8 mx-6 rounded-3xl py-6 p-2 text-2xl bg-dark-orange text-center text-off-white border border-black">
        Personal
      </div>
      <div className="mt-1 mx-6 rounded-3xl py-6 p-2 text-2xl bg-blue-500 text-center text-off-white border border-black">
        Funny
      </div>
      <div className="mt-1 mb-6 mx-6 rounded-3xl py-6 p-2 text-2xl bg-off-white text-center text-black border border-black font-semibold">
        Misc
      </div>
      {!sessionUser &&
        <>
          <div className="text-center mb-2">
            Sign Up to Post a Story Today!
          </div>
          <div className="flex justify-center">
            <button className="px-2 py-1 rounded-full bg-dark-orange font-light text-off-white mb-6">
              SIGN UP
            </button>
          </div>
        </>
      }
    </div>
  )
}
