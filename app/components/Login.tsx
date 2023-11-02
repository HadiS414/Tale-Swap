"use client"

import { signIn } from 'next-auth/react';

export default function Login() {
    return (
        <div className="flex justify-between gap-2">
            <button
                onClick={() => signIn('google', { redirect: true })}
                className="font-montserrat px-4 py-1 rounded-full bg-blue-500 text-white font-light"
            >
                SIGN UP
            </button>
            <button
                onClick={() => signIn('google', { redirect: true })}
                className="font-montserrat underline underline-offset-4 font-bold"
            >
                LOG IN
            </button>
        </div>
    )
}