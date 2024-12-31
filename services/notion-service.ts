import { BlogPost, PostPage, Tag } from "@/@types/schema";
import { Client } from "@notionhq/client";
import defaultCover from "../public/cover.jpg";
import { NotionToMarkdown } from "notion-to-md";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints"; // Import the type definition

export default class NotionService {
    client: Client;
    n2m: NotionToMarkdown;

    constructor() {
        this.client = new Client({ auth: process.env.NOTION_ACCESS_TOKEN });
        this.n2m = new NotionToMarkdown({ notionClient: this.client });
    }

    // returns all published posts
    async getPublishedPosts(): Promise<BlogPost[]> {
        const database = process.env.NOTION_BLOG_DATABASE_ID ?? "";

        if (!database) {
            throw new Error(
                "NOTION_BLOG_DATABASE_ID 환경 변수가 설정되지 않았습니다."
            );
        }

        try {
            const response = await this.client.databases.query({
                database_id: database,
                filter: {
                    property: "퍼블리시",
                    checkbox: {
                        equals: true,
                    },
                },
                sorts: [
                    {
                        property: "생성일",
                        direction: "descending",
                    },
                ],
            });

            return response.results.map((res) => {
                // transform res to blog post
                return NotionService.pageToPostTransformer(res);
            });
        } catch (error) {
            console.error("Error querying database:", error);
            throw error;
        }
    }

    // returns posts by their tags
    async getPostsByTag(tag: string): Promise<BlogPost[]> {
        const database = process.env.NOTION_BLOG_DATABASE_ID ?? "";
    
        if (!database) {
            throw new Error(
                "NOTION_BLOG_DATABASE_ID 환경 변수가 설정되지 않았습니다."
            );
        }
    
        try {
            const response = await this.client.databases.query({
                database_id: database,
                filter: {
                    property: "태그",
                    multi_select: {
                        contains: tag,
                    },
                },
                sorts: [
                    {
                        property: "생성일",
                        direction: "descending",
                    },
                ],
            });
    
            return response.results.map((res) => {
                // Transform res to blog post
                return NotionService.pageToPostTransformer(res);
            });
        } catch (error) {
            console.error("Error querying database:", error);
            throw error;
        }
    }

    // returns all tags from posts
    async getAllTags(): Promise<Tag[]> {
        const database = process.env.NOTION_BLOG_DATABASE_ID ?? "";
    
        if (!database) {
            throw new Error(
                "NOTION_BLOG_DATABASE_ID 환경 변수가 설정되지 않았습니다."
            );
        }
    
        try {
            const response = await this.client.databases.query({
                database_id: database,
                filter: {
                    property: "태그",
                    multi_select: {
                        is_not_empty: true,
                    },
                },
            });
    
            const tagCounts: { [tag: string]: { count: number, color: string, id: string } } = {};
    
            response.results.forEach((res) => {
                if ("properties" in res) {
                    const properties = (res as PageObjectResponse).properties;
                    if (properties["태그"]?.type === "multi_select") {
                        const postTags = properties["태그"].multi_select;
                        postTags.forEach((tag) => {
                            const color = tag.color || "#f9f9f9"; // Provide a default color if undefined
                            if (tagCounts[tag.name]) {
                                tagCounts[tag.name].count++;
                            } else {
                                tagCounts[tag.name] = { count: 1, color, id: tag.id };
                            }
                        });
                    }
                }
            });
    
            return Object.entries(tagCounts).map(([name, { count, color, id }]) => ({ id, name, count, color }));
        } catch (error) {
            console.error("Error querying database:", error);
            throw error;
        }
    }
    
    // returns the total post count
    async getTotalPostCount(): Promise<number> {
        const database = process.env.NOTION_BLOG_DATABASE_ID ?? "";

        if (!database) {
            throw new Error(
                "NOTION_BLOG_DATABASE_ID 환경 변수가 설정되지 않았습니다."
            );
        }

        try {
            const response = await this.client.databases.query({
                database_id: database,
                filter: {
                    property: "퍼블리시",
                    checkbox: {
                        equals: true,
                    },
                },
            });

            return response.results.length;
        } catch (error) {
            console.error("Error querying database:", error);
            throw error;
        }
    }

    // returns a single blog post as a markdown
    async getSingleBlogPost(slug: string): Promise<PostPage> {
        if (!slug) {
            throw new Error("Slug parameter is required");
        }
        let post, markdown;
        // console.log(`Fetching post for slug: ${slug}`);
        const database = process.env.NOTION_BLOG_DATABASE_ID ?? "";
        if (!database) {
            throw new Error(
                "NOTION_BLOG_DATABASE_ID environment variable is not set"
            );
        }
        try {
            const response = await this.client.databases.query({
                database_id: database,
                filter: {
                    property: "수식",
                    formula: {
                        string: {
                            equals: slug, // slug
                        },
                    },
                },
                sorts: [
                    {
                        property: "생성일",
                        direction: "descending",
                    },
                ],
            });
            if (!response.results.length) {
                throw new Error("No results available");
            }
            const page = response.results[0];
            // console.log(page);

            post = NotionService.pageToPostTransformer(page);
            // console.log("Post:", post);

            const mdblocks = await this.n2m.pageToMarkdown(page.id);
            markdown = this.n2m.toMarkdownString(mdblocks).parent;
            // console.log(mdblocks)
            // console.log(markdown)

            return { 
                post, 
                markdown 
            };
        } catch (error) {
            console.error("Error querying Notion database:", error);
            throw error;
        }
    }

    // returns post as an object
    private static pageToPostTransformer(page: any): BlogPost {
        let cover = page.cover;
        let coverImg = defaultCover;
        
        if (!cover) {
            cover = { type: "default", url: coverImg };
        }

        switch (cover.type) {
            case "file":
                cover = page.cover.file.url;
                break;
            case "external":
                cover = page.cover.external.url;
                // console.log(cover);
                break;
            default:
                cover = coverImg;
                break;
        }

        let tags = page.properties["태그"]?.multi_select || []

        if(tags.some(tag => tag.name === "weekly-paper")){
            cover = "https://raw.githubusercontent.com/numi8462/nextjs-blog/main/public/weeklypaper.png"
        } else if(tags.some(tag => tag.name === "programmers")){
            cover = "https://raw.githubusercontent.com/numi8462/nextjs-blog/main/public/programmers.png"
        } else if(tags.some(tag => tag.name === "codeit")){
            cover = "https://raw.githubusercontent.com/numi8462/nextjs-blog/main/public/codeit.png"
        }

        return {
            id: page.id,
            cover: cover,
            title:
                page.properties["이름"]?.title?.[0]?.plain_text || "제목 없음",
            tags: tags,
            description:
                page.properties["설명"]?.rich_text?.[0]?.plain_text ||
                "설명 없음",
            created:
                page.properties["생성일"]?.created_time ||
                new Date().toISOString(),
            updated:
                page.properties["수정일"]?.last_edited_time ||
                new Date().toISOString(),
            slug: page.properties["수식"]?.formula?.string || "수식 없음",
            // likes: page.properties["숫자"]?.number || 0,
        };
    }

    // // increase/decrease the likes of post
    // async updateLikes(pageId: string, action: 'like' | 'unlike'): Promise<number> {
    //     try {
    //         const response = await fetch('https://nextjs-blog-api.vercel.app/api/increaseLikes', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({ id: pageId, action }),
    //             credentials: 'include' // Ensure this is set
    //         });
    
    //         const data = await response.json();
    //         return data.likes;
    //     } catch (error) {
    //         console.error('Failed to update likes:', error);
    //         throw error;
    //     }
    // }

    // // return likes
    // async getLikes(pageId: string): Promise<number> {
    //     try {
    //         const response = await fetch('https://nextjs-blog-api.vercel.app/api/getLikes', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({ id: pageId }),
    //             credentials: 'include' // Ensure this is set
    //         });
    
    //         const data = await response.json();
    //         return data.likes;
    //     } catch (error) {
    //         console.error('Failed to get likes:', error);
    //         throw error;
    //     }
    // }
}
