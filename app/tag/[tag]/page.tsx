import { getCachedPostsByTag } from "@/services/notion-service";
import React from "react";
import Sidebar from "@/components/ui/Sidebar";
import Tags from "@/components/ui/Tags";
import BlogCard from "@/components/BlogCard";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ui/ScrollToTop";

export const revalidate = 3600;
export const dynamicParams = true;

const TagPage = async ({ params }) => {
  const { tag } = await params;
  const posts = await getCachedPostsByTag(tag);

  return (
    <div className="min-h-screen bg-black-100">
      <main className="mx-auto relative">
        <div className="flex justify-between relative">
          <Sidebar />
          <ScrollToTop />
          <div className="flex flex-col justify-center items-center h-full mx-auto w-full px-5 mt-16">
            <h1 className="text-7xl font-extrabold font-fugaz mx-auto max-md:text-4xl text-white">{`"${tag}"`}</h1>
            <div className="xl:hidden">
              <Tags />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-10 w-full items-start place-items-center popupFromLeft">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
            <div className="w-full flex justify-center items-center">
              <Footer />
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

export default TagPage;
