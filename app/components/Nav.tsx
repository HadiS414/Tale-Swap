import Link from "next/link";
import Login from "./Login";
import LoggedIn from "./LoggedIn";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../pages/api/auth/[...nextauth]"
import GenreNav from "./GenreNav";

export default async function Nav() {
    const session = await getServerSession(authOptions);
    return (
        <nav className="flex py-6 px-6 lg:px-16 justify-between border-b border-black">
            <div className="flex gap-8">
                <Link className="py-2 px-4 font-bold text-teal-600 hover:text-teal-500 active:text-teal-300" href={"/"}>
                    Home
                </Link>
                {session &&
                    <>
                        <Link className="py-2 px-4 font-bold text-teal-600 hover:text-teal-500 active:text-teal-300" href={"/myPosts"}>
                            My Posts
                        </Link>
                        <Link className="py-2 px-4 font-bold text-teal-600 hover:text-teal-500 active:text-teal-300" href={"/following"}>
                            Following
                        </Link>
                    </>
                }
                <GenreNav />
            </div>
            <div>
                {!session?.user && <Login />}
                {session?.user && <LoggedIn image={session.user?.image || ""} />}
            </div>
        </nav>
    )
}