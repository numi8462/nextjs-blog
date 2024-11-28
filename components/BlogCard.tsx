import { BlogPost } from "@/@types/schema";
import dayjs from "dayjs";
import Link from "next/link";
import React, { FunctionComponent } from "react";

type BlogCardProps = {
    post: BlogPost;
};

const localizedFormat = require("dayjs/plugin/localizedFormat");
dayjs.extend(localizedFormat);

const BlogCard: FunctionComponent<BlogCardProps> = ({ post }) => {
    return (
        <Link href={`/post/${post.id}`}>
            <div className="flex flex-1 p-5 border-[2px] border-yellow rounded-xl w-full zoom-effect">
                <div className="flex flex-col gap-2">
                    <span className="block">
                        <h4>{dayjs(post.created).format("YYYY-MM-DD")}</h4>
                    </span>
                    <span className="block">
                        <h3 className="text-3xl font-bold">{post.title}</h3>
                    </span>
                    <span className="block">
                        <p className="">{post.description}</p>
                    </span>
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
                </div>
            </div>
        </Link>
    );
};

export default BlogCard;
