"use client"

import Image from "next/image";
import { Dropdown } from "antd";
import { signOut } from "next-auth/react";
import Link from "next/link";
import type { MenuProps } from 'antd';

type Props = {
    image: string,
    email: string
}

export default function LoggedIn({ image, email }: Props) {
    const items: MenuProps['items'] = [
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
                    <p className="font-montserrat font-semibold"> {email} </p>
                </div>
            ),
        },
        {
            key: '2',
            label: (
                <Link href={'/profile'}>
                    <p className="font-montserrat font-bold">
                        Profile
                    </p>
                </Link>
            ),
        },
        {
            key: '3',
            label: (
                <Link href={'/bookmarked'}>
                    <p className="font-montserrat font-bold">
                        Bookmarked
                    </p>
                </Link>
            ),
        },
        {
            key: '4',
            onClick: () => signOut(),
            label: (
                <button className="font-montserrat text-red-600 font-bold">
                    Log out
                </button>
            ),
        },
    ];

    return (
        <div>
            <Dropdown menu={{ items }} trigger={["click"]} className="cursor-pointer">
                <div className="flex items-center gap-2">
                    <Image width={40} height={40} src={image} alt={"User image..."} className="rounded-full" />
                    <p className="hidden sm:block font-montserrat"> {email} </p>
                </div>
            </Dropdown>
        </div>
    )
}

