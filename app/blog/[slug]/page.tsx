import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import Head from "next/head";
import NotionService from "@/services/notion-service";
import { PostPage } from "@/@types/schema";
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
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const notionService = new NotionService();
  const p: PostPage = await notionService.getSingleBlogPost(params.slug);

  if (!p) {
    return {
      title: "Not Found",
      description: "The page you are looking for does not exist.",
    };
  }

  const post = p.post;

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: [
        {
          url: post.cover,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
  };
}

const Post = async ({ params }) => {
  const notionService = new NotionService();
  const p: PostPage = await notionService.getSingleBlogPost(
    (
      await params
    ).slug
  );

  if (!p) {
    notFound();
  }
  // console.log(p);
  const post = p.post;

  return (
    <>
      <Head>
        <title>{p.post.title}</title>
        <meta name="description" content={p.post.description} />
        <meta name="og:title" content={p.post.title} />
        <meta name="og:description" content={p.post.description} />
        <meta name="og:image" content={p.post.cover} />
      </Head>

      <div className="min-h-screen bg-black-100">
        <Navbar />
        <ScrollToTop />
        <main className="mx-auto flex justify-between">
          <Sidebar />
          <article className="prose max-w-3xl mt-10 mx-auto font-nanum p-5 popupFromLeft w-[100vw]">
            <div className="flex flex-col justify-center items-center">
              <h1 className="block text-white text-7xl font-bold font-nanum max-md:text-5xl text-center mb-4">
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
                className={"reactMarkDown w-full"}
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

export async function generateStaticParams() {
  const notionService = new NotionService();
  const posts = await notionService.getPublishedPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default Post;
