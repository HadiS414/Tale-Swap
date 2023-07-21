import Link from "next/link";
import Login from "./Login";
import LoggedIn from "./LoggedIn";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import Image from "next/image";
import mobileLogo from "../TS_mobile_logo.svg";
import GenreNav from "./GenreNav";

export default async function Nav() {
    const session = await getServerSession(authOptions);
    return (
        <nav className="flex py-3 px-6 lg:px-16 justify-between">
            <div className="flex gap-8">
                <Image
                    src={mobileLogo}
                    alt="Mobile logo..."
                />
            </div>
            <div>
                {!session?.user && <Login />}
                {session?.user && <LoggedIn image={session.user?.image || ""} email={session.user.email || ""} />}
            </div>
        </nav>
    )
}