import React from "react";
import Link from "next/link";

const Navbar = () => {
    return (
        <nav className="flex flex-col items-start justify-start sticky top-0 bg-black-100 xl:hidden w-[100dvw]">
            <Link href={"/"} className="flex items-center gap-2 p-5">
                <h1 className="font-extrabold text-3xl text-white hover:text-yellow-500 hover:underline font-fugaz">
                    YLOG
                </h1>
            </Link>
        </nav>

    );
};

export default Navbar;
