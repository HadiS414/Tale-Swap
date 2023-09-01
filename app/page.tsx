"use client"

import CreatePost from "./components/CreatePost"
import Post from "./components/Post";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { PostType } from "./types/Post";
import { FilterOutlined } from "@ant-design/icons";
import { Dropdown, MenuProps } from "antd";
import { useState } from "react";
import Image from "next/image";
import pencil from "./images/Pencil.svg"
import Link from "next/link";

const fetchPosts = async () => {
  const res = await axios.get("/api/posts/getPosts");
  return res.data;
}

export default function Home() {
  const [genre, setGenre] = useState("FOLLOWING");
  const { data, isLoading } = useQuery<PostType[]>({
    queryFn: fetchPosts,
    queryKey: ["posts"]
  })
  if (isLoading) {
    return <h1> Loading... </h1>
  }

  const onClick: MenuProps['onClick'] = ({ key }) => {
    setGenre(key);
  };

  const items = [
    {
      key: 'FOLLOWING',
      label: (
        <p className="font-medium">
          Following
        </p>
      ),
    },
    {
      key: 'FUNNY',
      label: (
        <p className="font-medium">
          Funny
        </p>
      ),
    },
    {
      key: 'PERSONAL',
      label: (
        <p className="font-medium">
          Personal
        </p>
      ),
    },
    {
      key: 'MISC',
      label: (
        <p className="font-medium">
          Misc
        </p>
      ),
    },
  ];

  return (
    <div>
      <div className="bg-dark-orange">
        <h1 className="text-2xl font-bold font-verdana text-off-white p-3">
          {genre}
        </h1>
        {/* <Dropdown menu={{ items, onClick }}>
          <FilterOutlined className="text-2xl" />
        </Dropdown> */}
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
