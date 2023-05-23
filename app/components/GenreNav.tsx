"use client"

import { Dropdown } from "antd";
import Link from "next/link";

const items = [
    {
        key: '1',
        label: (
            <Link href={"/funny"}>
                Funny
            </Link>
        ),
    },
    {
        key: '2',
        label: (
            <Link href={"/horror"}>
                Horror
            </Link>
        ),
    },
    {
        key: '3',
        label: (
            <Link href={"/adventure"}>
                Adventure
            </Link>
        ),
    },
    {
        key: '4',
        label: (
            <Link href={"/misc"}>
                Misc
            </Link>
        ),
    },
];

export default function GenreNav() {
    return (
        <Dropdown menu={{ items }}>
            <p className="py-2 px-4 font-bold text-teal-600 hover:text-teal-500">
                Genre
            </p>
        </Dropdown>
    )
}