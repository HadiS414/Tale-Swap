"use client"

import CreatePost from "./components/CreatePost"
import Post from "./components/Post";
import axios from "axios";
import { signIn } from 'next-auth/react';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PostType } from "./types/Post";
import Image from "next/image";
import pencil from "./images/Pencil.svg"
import Link from "next/link";
import ScrollingNewCreators from "./components/ScrollingNewCreators";
import { SessionUser } from "./types/SessionUser";
import { useState } from "react";
import SideBarPosts from "./components/SideBarPosts";
import SideBarMyPost from "./components/SideBarMyPost";

type ScrollingFilterButton = {
  label: string;
  active: boolean;
  action: () => void;
}

const fetchSessionUser = async () => {
  const res = await axios.get("/api/auth/getSessionUser");
  return res.data;
}
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

export default function Home() {
  const queryClient = useQueryClient();
  const [isFollowingActive, setIsFollowingActive] = useState(false);
  const [isPersonalActive, setIsPersonalActive] = useState(false);
  const [isFunnyActive, setIsFunnyActive] = useState(false);
  const [isMiscActive, setIsMiscActive] = useState(false);

  const { data: sessionUser, isLoading: sessionUserLoading } = useQuery<SessionUser>({
    queryFn: fetchSessionUser,
    queryKey: ["sessionUser"]
  });
  const { data, isLoading } = useQuery<PostType[]>({
    queryFn: fetchAllPosts,
    queryKey: ["posts"]
  })

  const buttons: ScrollingFilterButton[] = [
    {
      label: "Following",
      active: isFollowingActive,
      action: () => {
        queryClient.fetchQuery(["posts"], fetchFollowingPosts);
        setIsFollowingActive(true);
        setIsPersonalActive(false);
        setIsFunnyActive(false);
        setIsMiscActive(false);
      }
    },
    {
      label: "Personal",
      active: isPersonalActive,
      action: () => {
        queryClient.fetchQuery(["posts"], () => fetchGenrePosts("Personal"));
        setIsPersonalActive(true);
        setIsFollowingActive(false);
        setIsFunnyActive(false);
        setIsMiscActive(false);
      }
    },
    {
      label: "Funny",
      active: isFunnyActive,
      action: () => {
        queryClient.fetchQuery(["posts"], () => fetchGenrePosts("Funny"));
        setIsFunnyActive(true);
        setIsPersonalActive(false);
        setIsFollowingActive(false);
        setIsMiscActive(false);
      }
    },
    {
      label: "Misc",
      active: isMiscActive,
      action: () => {
        queryClient.fetchQuery(["posts"], () => fetchGenrePosts("Misc"));
        setIsMiscActive(true);
        setIsPersonalActive(false);
        setIsFunnyActive(false);
        setIsFollowingActive(false);
      }
    },
  ]

  return (
    <div>
      <div className="bg-dark-orange sm:p-7">
        <h1 className="text-3xl font-bold font-verdana text-off-white p-3 ml-4 cursor-pointer sm:hidden" onClick={() => {
          queryClient.fetchQuery(["posts"], fetchAllPosts);
          setIsFollowingActive(false);
          setIsPersonalActive(false);
          setIsFunnyActive(false);
          setIsMiscActive(false);
        }}>
          HOME
        </h1>
      </div>
      <div className="sm:flex sm:mt-8 sm:mx-12 sm:justify-center relative">
        <div className="hidden sm:block sm:w-72 2xl:w-96 sticky">
          <div className="border rounded-3xl shadow pl-2">
            <SideBarPosts
              sessionUser={sessionUser}
            />
          </div>
        </div>
        <div className="sm:w-2/5 2xl:w-1/3 sm:mx-8">
          <h1 className="text-2xl font-extrabold cursor-pointer hidden sm:block font-verdana" onClick={() => {
            queryClient.fetchQuery(["posts"], fetchAllPosts);
            setIsFollowingActive(false);
            setIsPersonalActive(false);
            setIsFunnyActive(false);
            setIsMiscActive(false);
          }}>
            HOME
          </h1>
          {sessionUser &&
            <div className="flex">
              <div className="flex gap-2 ml-6 sm:ml-0 overflow-x-auto no-scrollbar">
                {buttons.map((button, index) => (
                  <button
                    key={index}
                    className={`font-montserrat rounded-full px-3 py-[2px] sm:py-[1px] mt-3 border border-black ${button.active ? "bg-blue-500 text-off-white" : "bg-off-white"}`}
                    onClick={button.action}
                  >
                    {button.label}
                  </button>
                ))}
              </div>
            </div>
          }
          {sessionUser &&
            <div className="hidden sm:block">
              <CreatePost />
            </div>
          }
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
          {!sessionUserLoading &&
            <div className="sm:hidden mx-6">
              <ScrollingNewCreators sessionUser={sessionUser} />
              <div
                className="font-montserrat mt-8 rounded-3xl py-6 p-2 text-2xl bg-dark-orange text-center text-off-white border border-black"
                onClick={buttons[1].action}
              >
                Personal
              </div>
              <div
                className="font-montserrat mt-1 rounded-3xl py-6 p-2 text-2xl bg-blue-500 text-center text-off-white border border-black"
                onClick={buttons[2].action}
              >
                Funny
              </div>
              <div
                className="font-montserrat mt-1 mb-6 rounded-3xl py-6 p-2 text-2xl bg-off-white text-center text-black border border-black font-semibold"
                onClick={buttons[3].action}
              >
                Misc
              </div>
              {!sessionUser && !sessionUserLoading &&
                <>
                  <div className="font-montserrat text-center mb-2">
                    Sign Up to Post a Story Today!
                  </div>
                  <div className="flex justify-center">
                    <button
                      className="font-montserrat px-2 py-1 rounded-full bg-dark-orange font-light text-off-white mb-6"
                      onClick={() => signIn('google', { redirect: true })}
                    >
                      SIGN UP
                    </button>
                  </div>
                </>
              }
            </div>
          }
        </div>
        <div className="hidden sm:block w-80 mt-6 sticky right-16">
          <ScrollingNewCreators sessionUser={sessionUser} />
          {!sessionUserLoading &&
            <>
              {!sessionUser ?
                <div className="flex items-center justify-center border shadow rounded-3xl pl-2 mt-4 h-32">
                  <div className="flex flex-col items-center">
                    <div className="font-montserrat text-center mb-2">
                      Sign Up to Post a Story Today!
                    </div>
                    <button
                      className="font-montserrat px-2 py-1 rounded-full bg-blue-500 font-light text-off-white mb-2"
                      onClick={() => signIn('google', { redirect: true })}
                    >
                      SIGN UP
                    </button>
                  </div>
                </div>
                :
                <>
                  {sessionUser.posts.length > 0 &&
                    <div className="border shadow rounded-3xl pl-2 mt-4">
                      <h1 className="text-2xl font-extrabold mt-2 ml-1 font-montserrat">
                        My Stories
                      </h1>
                      <SideBarMyPost
                        sessionUser={sessionUser}
                      />
                    </div>
                  }
                </>
              }
            </>
          }
        </div>
      </div>
    </div>
  )
}
