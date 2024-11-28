import React from "react";
import Image from "next/image";

const Navbar = () => {
    return (
        <nav className="flex items-center justify-start p-5 gap-2 shadow-lg  bg-black-100">
            <Image
                src={"./logo.svg"}
                alt="blog icon"
                width={40}
                height={40}
            />
            <h1 className="font-extrabold text-4xl text-white">Blog</h1>
        </nav>

    );
};

export default Navbar;
