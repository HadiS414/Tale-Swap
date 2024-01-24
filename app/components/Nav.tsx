import Login from "./Login";
import LoggedIn from "./LoggedIn";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import Image from "next/image";
import mobileLogo from "../images/TS_mobile_logo.svg";
import desktopLogo from "../images/TS_desktop_logo.svg"
import Link from "next/link";

export default async function Nav() {
    const session = await getServerSession(authOptions);

    return (
        <nav className="flex py-3 px-6 lg:px-16 justify-between items-center sticky top-0 bg-off-white z-10">
            <div className="flex gap-2">
                <Link href={"/"}>
                    <Image
                        src={desktopLogo}
                        alt="Desktop logo..."
                        className="hidden sm:block"
                    />
                </Link>
                <Link href={"/"}>
                    <Image
                        src={mobileLogo}
                        alt="Mobile logo..."
                    />
                </Link>
            </div>
            <div>
                {!session?.user && <Login />}
                {session?.user && <LoggedIn image={session.user?.image || ""} email={session.user.email || ""} />}
            </div>
        </nav>
    )
}