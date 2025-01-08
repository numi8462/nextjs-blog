import NotionService from '@/services/notion-service';
import React from 'react';
import { BlogPost } from '@/@types/schema';
import Sidebar from '@/components/ui/Sidebar';
import Tags from '@/components/ui/Tags';
import BlogCard from '@/components/BlogCard';
import Footer from '@/components/Footer';

const TagPage = async ({ params }) => {
    const notionService = new NotionService();
    const posts: BlogPost[] = await notionService.getPostsByTag(params.tag);

    return (
        <div className="min-h-screen bg-black-100">
            <main className="mx-auto relative">
                <div className="flex justify-between relative">
                    <Sidebar />

                    <div className="flex flex-col justify-center items-center h-full mx-auto w-full px-5 mt-16">
                        <h1 className="text-7xl font-extrabold font-fugaz mx-auto max-md:text-4xl text-white">{`"${params.tag}"`}</h1>
                        <div className="xl:hidden">
                            <Tags />
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-10 w-full items-start place-items-center popupFromLeft">
                            {posts.map((post) => (
                                <BlogCard key={post.id} post={post} />
                            ))}
                        </div>
                        <div className="w-full flex justify-center items-center">
                            <Footer/>
                        </div>
                    </div>

                    <div className="flex flex-col sticky top-0 h-[calc(100vh)] p-5 sidebar min-w-[20rem]">
                        <Tags />
                    </div>
                </div>

            </main>
            
        </div>
    );
};

export async function generateStaticParams() {
    const notionService = new NotionService();
    const tags = await notionService.getAllTags();

    return tags.map((tag) => ({
        tag: tag.name
    }))
}

export default TagPage;
