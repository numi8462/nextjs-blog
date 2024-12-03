import { BlogPost } from "@/@types/schema";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import React, { FunctionComponent } from "react";

type BlogCardProps = {
    post: BlogPost;
};

const BlogCard: FunctionComponent<BlogCardProps> = ({ post }) => {
    return (
        <Link href={`/blog/${post.slug}`}>
            <div className="flex flex-col flex-1 max-w-[600px]">
                <div className="flex flex-col gap-2 relative group ">
                    <div>
                        <Image className="h-[300px] rounded-xl object-cover" height={300} width={600} src={post.cover} alt="cover image"/>
                    </div>
                    <div className={"flex flex-col h-full justify-between absolute p-5 rounded-xl w-full bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"}>
                        <span className="block space-x-4">
                            {post.tags.map((tag) => (
                                <span
                                    key={tag.id}
                                    className="bg-white text-black px-2 py-1 text-sm rounded-xl"
                                >
                                    {tag.name}
                                </span>
                            ))}
                        </span>
                        <span className="text-white">
                            <p className="text-2xl ">{post.description}</p>
                        </span>
                    </div>
                </div>
                <div className="flex flex-col p-2">
                    <span>
                        <h4 className="text-2xl">{dayjs(post.created).format("YYYY-MM-DD")}</h4>
                    </span>
                    <span>
                        <h3 className="text-4xl font-bold leading-normal">{post.title}</h3>
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default BlogCard;
