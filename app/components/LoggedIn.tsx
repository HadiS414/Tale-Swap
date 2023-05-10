'use client'

import Image from "next/image";
import { signOut } from "next-auth/react";

type Image = {
    image: string
}

export default function LoggedIn({ image }: Image) {
    return (
        <div className="flex gap-8 items-center">
            <Image width={48} height={48} src={image} alt={"User image..."} className="rounded-full" />
            <button
                onClick={() => signOut()}
                className="bg-teal-600 text-white font-medium py-2 px-4 rounded-md hover:bg-teal-500 active:bg-teal-300">
                Sign Out
            </button>
        </div>
    )
}

