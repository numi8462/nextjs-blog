import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import NotionService, {
  getCachedSingleBlogPost,
} from "@/services/notion-service";
import Sidebar from "@/components/ui/Sidebar";
import SearchBar from "@/components/ui/Tags";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import Image from "next/image";
import dayjs from "dayjs";
import Footer from "@/components/Footer";
import Navbar from "@/components/ui/Navbar";
import remarkGfm from "remark-gfm";
import ScrollToTop from "@/components/ui/ScrollToTop";
import type { Metadata } from "next";

const notionService = new NotionService();

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const posts = await notionService.getPublishedPosts();

  const params: { slug: string }[] = [];
  for (const post of posts) {
    params.push({ slug: post.slug });
    await new Promise((res) => setTimeout(res, 500));
  }

  return params;
}

export async function generateMetadata({ params }): Promise<Metadata> {
  const { slug } = await params;
  const p = await getCachedSingleBlogPost(slug);

  if (!p) {
    return {
      title: "Post Not Found - Ylog",
      description: "The post you're looking for doesn't exist.",
    };
  }

  const post = p.post;
  const tags = p.post.tags;

  let defaultCoverUrl =
    "https://raw.githubusercontent.com/numi8462/nextjs-blog/refs/heads/main/public/cover/webdev.png";

  if (typeof post.cover !== "string") {
    switch (true) {
      case tags.some((tag) => tag.name === "weekly"):
        defaultCoverUrl =
          "https://raw.githubusercontent.com/numi8462/nextjs-blog/main/public/cover/weeklypaper.png";
        break;
      case tags.some((tag) => tag.name === "programmers"):
        defaultCoverUrl =
          "https://raw.githubusercontent.com/numi8462/nextjs-blog/main/public/cover/programmers.png";
        break;
      case tags.some((tag) => tag.name === "codeit"):
        defaultCoverUrl =
          "https://raw.githubusercontent.com/numi8462/nextjs-blog/main/public/cover/codeit.png";
        break;
      case tags.some((tag) => tag.name === "javascript"):
        defaultCoverUrl =
          "https://raw.githubusercontent.com/numi8462/nextjs-blog/main/public/cover/js.jpeg";
        break;
      default: // Optional default case if none of the tags match
        break;
    }
  }
  const coverUrl =
    typeof post.cover === "string" ? post.cover : defaultCoverUrl;

  // console.log("URL:" + coverUrl);

  return {
    title: `${post.title} - Ylog`,
    description: post.description || "Read this post on Ylog.",
    openGraph: {
      title: post.title,
      description: post.description || "",
      images: [
        {
          url: coverUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
  };
}

const Post = async ({ params }) => {
  const p = await getCachedSingleBlogPost((await params).slug);

  if (!p) {
    notFound();
  }
  // console.log(p);
  const post = p.post;

  return (
    <>
      <div className="min-h-screen bg-black-100">
        <Navbar />
        <ScrollToTop />
        <main className="mx-auto flex justify-between">
          <Sidebar />
          <article className="prose max-w-3xl mt-10 mx-auto font-nanum p-5 popupFromLeft w-[100vw]">
            <div className="flex flex-col justify-center items-center">
              <h1 className="block text-white text-7xl font-bold font-nanum max-md:text-5xl text-center mb-4 leading-[5rem] word-break-keep-all">
                {post.title}
              </h1>

              <div className="flex flex-col w-full">
                <span className="flex items-center justify-between text-white font-bold">
                  <p>Updated: {dayjs(post.created).format("YYYY-MM-DD")}</p>
                </span>
                <span className="block space-x-4">
                  {post.tags.map((tag) => (
                    <a
                      href={`/nextjs-blog/tag/${tag.name}`}
                      key={tag.id}
                      className="bg-white text-black px-4 py-2 text-lg rounded-xl no-underline hover:bg-yellow"
                    >
                      {tag.name}
                    </a>
                  ))}
                </span>
              </div>

              <Image
                className="rounded-xl object-cover"
                src={post.cover}
                alt="cover image"
                layout="responsive"
                width={100}
                height={100}
              />

              <ReactMarkdown
                className={"reactMarkDown w-full break-keep"}
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ className, ...props }) {
                    const hasLang = /language-(\w+)/.exec(className || "");
                    return hasLang ? (
                      <div className="w-[100%]">
                        <SyntaxHighlighter
                          style={oneDark}
                          language={hasLang[1]}
                          PreTag="div"
                          className="mockup-code scrollbar-thin scrollbar-track-base-content/5 scrollbar-thumb-base-content/40 scrollbar-track-rounded-md scrollbar-thumb-rounded"
                          showLineNumbers={true}
                          useInlineStyles={true}
                        >
                          {String(props.children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <code className={`${className}`} {...props} />
                    );
                  },
                }}
              >
                {p.markdown}
              </ReactMarkdown>
              <div className="w-full flex justify-center items-center">
                <Footer />
              </div>
            </div>
          </article>
          <div className="flex flex-col sticky top-0 h-[calc(100vh)] p-5 sidebar min-w-[20rem]">
            <SearchBar />
          </div>
        </main>
      </div>
    </>
  );
};

export default Post;
