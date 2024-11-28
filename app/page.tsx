import Image from "next/image";
import { BlogPost } from "../@types/schema";
import BlogCard from "../components/BlogCard";
import NotionService from "../services/notion-service";
import Navbar from "@/components/ui/Navbar";
import ProfilePic from "@/public/profile.png";
import SearchBar from "@/components/ui/SearchBar";

const Home = async () => {
    const notionService = new NotionService();
    const posts: BlogPost[] = await notionService.getPublishedPosts();
    return (
        <div className="min-h-screen bg-black-100">
            <div className="sticky top-0 z-50"> {/* Make sure this z-index is higher */}
                <Navbar />
            </div>
            <main className="mx-auto relative">
                <div className="flex justify-between w-full relative">
                    <div className="flex flex-col items-center sticky top-20 h-[calc(100vh-80px)] p-5 w-[20rem] sidebar ">
                        <div className="flex flex-col items-center justify-center w-[20rem] p-5 ">
                            <Image src={ProfilePic} alt="profile picture" width={200} height={200}/>
                            <div className="flex flex-col">
                                <h1 className="text-2xl font-bold">@김영호</h1>
                                <p>안녕하세요, 프론트앤드 개발자<br/> 김영호 입니다.</p>
                            </div>
                            
                        </div>
                    </div>

                    <div className="flex justify-center h-full mx-auto mt-10 w-full px-10">
                        <div className="flex flex-col flex-1 max-w-[50rem] gap-10">
                            {posts.map((post) => (
                                <BlogCard key={post.id} post={post} />
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col sticky top-20 h-[calc(100vh-80px)] p-5 sidebar w-[40rem]">
                        <SearchBar />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Home;
