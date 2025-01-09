import React from "react";
import Image from "next/image";
import ProfilePic from "@/public/profile.png";
import Link from "next/link";

const Sidebar = () => {
    return (
        <div className="flex flex-col sticky top-0 h-[calc(100vh)] min-w-[20rem] sidebar ">
            <Link href={"/"} className="flex items-center gap-2 p-5">
                <h1 className="font-extrabold text-3xl text-white hover:text-yellow-500 hover:underline font-fugaz">
                    YLOG
                </h1>
            </Link>
            <div className="flex flex-col items-center justify-center mt-10 gap-5">
                <div className="relative">
                    <Image
                        src={ProfilePic}
                        alt="profile picture"
                        width={200}
                        height={200}
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <a href={"https://github.com/numi8462/"} className="flex justify-start items-center gap-1 hover:text-yellow">
                        <span className="text-2xl font-bold leading-10">@numi</span>
                    </a>
                        
                    <p>
                        안녕하세요, 프론트앤드 개발자
                        <br /> 김영호 입니다.
                    </p>
                </div>
                
                
                    
            </div>
        </div>
    );
};

export default Sidebar;
