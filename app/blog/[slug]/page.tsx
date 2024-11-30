import { notFound } from 'next/navigation';
import ReactMarkdown from "react-markdown";
import Head from "next/head";
import NotionService from '@/services/notion-service';
import { PostPage } from '@/@types/schema';
import { FunctionComponent } from 'react';


type PageProps = { 
    params: {
      slug: string;
    };
}

const Post: FunctionComponent<PageProps> = async ({ params }) => {
    const notionService = new NotionService();
    const p: PostPage | null = await notionService.getSingleBlogPost(params.slug);

    if (!p) {
        notFound();
    }
    console.log(p)

    return (
        <>
            <Head>
                <title>{p.post.title}</title>
                <meta name="description" content={p.post.description}/>
                <meta name="og:title" content={p.post.title}/>
                <meta name="og:description" content={p.post.description}/>
                <meta name="og:image" content={p.post.cover}/>
            </Head>

            <div className="min-h-screen">
                <main className="max-w-5xl mx-auto relative">
                    <div className="flex items-center justify-center">
                        <article className="prose">
                            <ReactMarkdown>{p.markdown}</ReactMarkdown>
                        </article>
                    </div>
                </main>
            </div>
        </>
    )
}

export async function generateStaticParams() {
    const notionService = new NotionService();
    const posts = await notionService.getPublishedPosts();

    return posts.map(post => ({
        slug: post.slug
    }));
}


export default Post;
