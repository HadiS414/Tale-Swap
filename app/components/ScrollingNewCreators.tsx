"use client"

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { User } from "../types/User";
import Link from "next/link";
import { SessionUser } from "../types/SessionUser";

type Props = {
    sessionUser: SessionUser | undefined
}

const fetchNewUsers = async () => {
    const res = await axios.get("/api/auth/getNewUsers");
    return res.data;
}

export default function ScrollingNewCreators({ sessionUser }: Props) {
    const { data, isLoading } = useQuery<User[]>({
        queryFn: fetchNewUsers,
        queryKey: ["new-users"]
    });

    console.log(data);

    return (
        <div className="sm:border sm:shadow sm:rounded-3xl p-2 sm:w-80 overflow-x-auto sm:no-scrollbar">
            <h1 className="font-montserrat mb-2 text-3xl font-semibold sm:text-2xl"> New Creators </h1>
            <div className="flex gap-6">
                {data?.slice(0, 3).map((user) => (
                    <>
                        <div className="flex-col justify-center">
                            {sessionUser ?
                                <Link href={user.id === sessionUser?.id ? '/profile' : `/profile/${user.id}`}>
                                    <Image
                                        width={80}
                                        height={80}
                                        src={user.image}
                                        alt="User Profile..."
                                        className="mt-4 rounded-full h-[80px] sm:h-[72px]"
                                    />
                                    <p className="font-montserrat font-semibold text-center w-[80px] sm:w-[72px]"> {user.name} </p>
                                </Link>
                                :
                                <>
                                    <Image
                                        width={80}
                                        height={80}
                                        src={user.image}
                                        alt="User Profile..."
                                        className="mt-4 rounded-full h-[80px] sm:h-[72px]"
                                    />
                                    <p className="font-montserrat font-semibold text-center w-[80px] sm:w-[72px]"> {user.name} </p>
                                </>
                            }
                        </div>
                    </>
                ))}
            </div>
        </div>
    )
}