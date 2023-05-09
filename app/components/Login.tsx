'use client'

import { signIn } from 'next-auth/react';

export default function Login() {
    return (
        <button
            onClick={() => signIn()}
            className="bg-teal-600 text-white font-medium py-2 px-4 rounded-md hover:bg-teal-500 active:bg-teal-300">
            Sign In
        </button>
    )
}