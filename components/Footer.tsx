import { FaLocationArrow } from "react-icons/fa6";
import Image from "next/image";
import gitIcon from "@/public/git.svg"

const Footer = () => {
    return (
        <footer
            className="w-full pt-20 pb-10 bg-black-100"
            id="contact"
        >
            <div className="flex flex-col items-center justify-center">
                <p className="text-white-200 md:mt-10 my-5 text-center">
                    문의 사항이 있으시면 언제든지 개인 메일로 연락 주시기 바랍니다.
                </p>
				<a href="mailto:yhk8462@naver.com" className="flex justify-center items-center gap-2 text-white">메일 보내기 <FaLocationArrow/></a>
            </div>
            
            <div className="flex justify-center items-center">
                <a href={"https://github.com/numi8462/"} className="flex justify-start items-center gap-1 mt-5">
                    <Image src={gitIcon} alt="git icon" width={25}/>
                </a>
            </div>

            <div className="flex mt-16 md:flex-row flex-col justify-center items-center text-white-200">
                <p className="md:text-base text-sm md:font-normal font-light ">
                    © 2024. kimyoungho all rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
