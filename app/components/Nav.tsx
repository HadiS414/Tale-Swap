import Link from "next/link";
import Login from "./Login";
import LoggedIn from "./LoggedIn";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../pages/api/auth/[...nextauth]"

export default async function Nav() {
    const session = await getServerSession(authOptions);
    return (
        <nav className="flex py-6 px-6 lg:px-16 justify-between bg-blue-200">
            <div className="flex gap-8">
                <Link className="py-2 px-4 font-bold hover:text-teal-500 active:text-teal-300" href={"/"}>
                    Home
                </Link>
                <Link className="py-2 px-4 font-bold hover:text-teal-500 active:text-teal-300" href={"/about"}>
                    About
                </Link>
            </div>
            <div>
                {!session?.user && <Login />}
                {session?.user && <LoggedIn image={session.user?.image || ""} />}
            </div>
        </nav>
    )
}