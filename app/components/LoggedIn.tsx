"use client"

import Image from "next/image";
import { Dropdown } from "antd";
import { signOut } from "next-auth/react";

type Props = {
    image: string,
    email: string
}

export default function LoggedIn({ image, email }: Props) {
    const items = [
        {
            key: '1',
            label: (
                <div className="flex items-center gap-2">
                    <Image
                        className="rounded-full"
                        width={32}
                        height={32}
                        src={image}
                        alt="Avatar..."
                    />
                    <p className="font-semibold"> {email} </p>
                </div>
            ),
        },
        {
            key: '2',
            label: (
                <p className="font-bold">
                    Profile
                </p>
            ),
        },
        {
            key: '3',
            label: (
                <p className="font-bold">
                    Bookmarked
                </p>
            ),
        },
        {
            key: '4',
            label: (
                <button className="text-red-600 font-bold" onClick={() => signOut()}>
                    Log out
                </button>
            ),
        },
    ];

    return (
        <div>
            <Dropdown menu={{ items }}>
                <Image width={40} height={40} src={image} alt={"User image..."} className="rounded-full" />
            </Dropdown>
        </div>
    )
}

