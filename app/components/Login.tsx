"use client"

import { signIn } from 'next-auth/react';

export default function Login() {
    return (
        <div className="flex justify-between gap-2">
            <button className="px-4 py-1 rounded-full bg-black text-white font-arial font-semibold">
                Sign Up
            </button>
            <button
                onClick={() => signIn()}
                className="underline underline-offset-4 font-bold font-arial">
                Log In
            </button>
        </div>
    )
}