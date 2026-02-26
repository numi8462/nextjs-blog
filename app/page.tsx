import BlogCard from "../components/BlogCard";
import { getCachedPublishedPosts } from "../services/notion-service";
import Tags from "@/components/ui/Tags";
import Sidebar from "@/components/ui/Sidebar";
import Footer from "@/components/Footer";
import Script from "next/script";
import ScrollToTop from "@/components/ui/ScrollToTop";

const Home = async () => {
  const posts = await getCachedPublishedPosts();

  return (
    <>
      <Script
        id="google-tag-manager"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=G-DLNS1CL25M`}
      />
      <Script id="google-tag-manager-script">
        {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-DLNS1CL25M');
                `}
      </Script>

      <div className="min-h-screen bg-black-100">
        <main className="mx-auto relative">
          <ScrollToTop />
          <div className="flex justify-between w-full relative">
            <Sidebar />

            <div className="flex flex-col justify-center items-center h-full mx-auto w-full px-5 mt-16">
              <h1 className="text-7xl font-extrabold font-fugaz text-white">
                {"POSTS."}
              </h1>
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
    </>
  );
};

export default Home;
