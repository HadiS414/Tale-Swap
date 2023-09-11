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
    if (isLoading) {
        return <h1> Loading... </h1>
    }

    return (
        <div>
            <h1 className="ml-8 mb-2 text-3xl font-semibold"> New Creators </h1>
            <div className="flex gap-8 ml-8">
                {data?.map((user) => (
                    <>
                        <div className="flex-col justify-center overflow-x-auto no-scrollbar w-[72px]">
                            {sessionUser ?
                                <Link href={user.id === sessionUser?.id ? '/profile' : `/profile/${user.id}`}>
                                    <Image
                                        width={72}
                                        height={72}
                                        src={user.image}
                                        alt="User Profile..."
                                        className="mt-4 rounded-full"
                                    />
                                    <p className="font-semibold text-center"> {user.name} </p>
                                </Link>
                                :
                                <>
                                    <Image
                                        width={72}
                                        height={72}
                                        src={user.image}
                                        alt="User Profile..."
                                        className="mt-4 rounded-full"
                                    />
                                    <p className="font-semibold text-center"> {user.name} </p>
                                </>
                            }
                        </div>
                    </>
                ))}
            </div>
        </div>
    )
}