import { BlogPost } from "../@types/schema";
import BlogCard from "../components/BlogCard";
import NotionService from "../services/notion-service";
import SearchBar from "@/components/ui/SearchBar";
import Sidebar from "@/components/ui/Sidebar";

const Home = async () => {
    const notionService = new NotionService();
    const posts: BlogPost[] = await notionService.getPublishedPosts();
    return (
        <div className="min-h-screen bg-black-100">
            {/* <div className="sticky top-0 z-50">
                <Navbar />
            </div> */}
            <main className="mx-auto relative">
                <div className="flex justify-between w-full relative">
                    <Sidebar />

                    <div className="flex flex-col justify-center items-center h-full mx-auto w-full px-10 mb-10 mt-5">
                        <h1 className="text-7xl font-extrabold font-fugaz">{"POSTS."}</h1>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-10 w-full items-start place-items-center">
                            {posts.map((post) => (
                                <BlogCard key={post.id} post={post} />
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col sticky top-0 h-[calc(100vh)] p-5 sidebar min-w-[20rem]">
                        <SearchBar />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Home;
