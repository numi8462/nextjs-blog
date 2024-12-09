import NotionService from "@/services/notion-service";
import Link from "next/link";
import React from "react";

const Tags = async () => {
    const notionService = new NotionService();
    const tags = await notionService.getAllTags();
    const count = await notionService.getTotalPostCount();

    return (
        <div className="flex flex-col justify-center items-center gap-10">
            <span className="text-4xl font-fugaz mt-10">
                Tags
            </span>

            <div className="w-full text-xl tags">
                <Link href={`/`} className="hover:underline">{`All (${count})`}</Link>
                {tags.map((tag)=>(
                    <Link href={`/tag/${tag.name}`} key={tag.id}>
                        <div className="my-2 hover:underline">
                            {`${tag.name} (${tag.count})`}
                        </div>
                    </Link>
                    
                ))}
            </div>
            
        </div>
    );
};

export default Tags;
