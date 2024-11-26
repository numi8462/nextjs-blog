import { BlogPost } from "../@types/schema";
// import BlogCard from "../components/BlogCard";
import NotionService from "../services/notion-service";
import Navbar from "@/components/ui/Navbar";

const Home = async () => {
    const notionService = new NotionService();
    const posts: BlogPost[] = await notionService.getPublishedPosts();
    return (
        <div className="min-h-screen bg-black-100">
            <main className="max-w-5xl mx-auto relative">
                <div className="h-full pt-4 pb-16 mx-auto">
                    <Navbar />
                    <div className="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-2 lg:max-w-none">
                        {posts.map((post) => (
                            // <BlogCard key={post.id} post={post} />

                            <>
                                {post.id}
                                <br />
                                {post.title}
                                <br />
                            </>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Home;
