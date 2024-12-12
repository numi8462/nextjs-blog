import React from "react";
import Image from "next/image";
import ProfilePic from "@/public/profile.png";
import gitIcon from "@/public/git.svg"
import Link from "next/link";

const Sidebar = () => {
    return (
        <div className="flex flex-col sticky top-0 h-[calc(100vh)] p-5 min-w-[20rem] sidebar ">
            <Link href={"/"} className="flex items-center gap-2">
                <h1 className="font-extrabold text-3xl text-white hover:text-yellow-500 hover:underline font-fugaz">
                    YLOG
                </h1>
            </Link>
            <div className="flex flex-col items-center justify-center p-2 mt-10 gap-5">
                <Image
                    src={ProfilePic}
                    alt="profile picture"
                    width={200}
                    height={200}
                />
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold leading-10">@ numi</h1>
                    <p>
                        안녕하세요, 프론트앤드 개발자
                        <br /> 김영호 입니다.
                    </p>
                </div>
                <div className="flex block">
                    <a href={"https://github.com/numi8462/"} className="flex gap-1 justify-start items-center text-blue-500 underline">
                        <Image src={gitIcon} alt="git icon" width={20}/>
                        github.com/numi8462
                    </a>
                </div>
                
                    
            </div>
        </div>
    );
};

export default Sidebar;
