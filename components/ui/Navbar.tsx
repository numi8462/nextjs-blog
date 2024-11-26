import React from "react";
import Image from "next/image";

const Navbar = () => {
    return (
        <div className="flex items-center justify-start p-5 gap-2 fixed top-0">
            <Image
                src={"./blog.svg"}
                alt="blog icon"
                width={40}
                height={40}
            />
            <h1 className="font-extrabold text-4xl text-white">YBlog</h1>
        </div>

    );
};

export default Navbar;
