import { BlogPost, PostPage } from "@/@types/schema";
import { Client } from "@notionhq/client";
import coverImage from "../public/cover.jpg";
import { NotionToMarkdown } from "notion-to-md";

export default class NotionService {
    client: Client;
    n2m: NotionToMarkdown;

    constructor() {
        this.client = new Client({ auth: process.env.NOTION_ACCESS_TOKEN });
        this.n2m = new NotionToMarkdown({ notionClient: this.client });
    }

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

    async getSingleBlogPost(slug: string): Promise<PostPage | null> {
        if (!slug) {
            throw new Error("Slug parameter is required");
        }
        let post, markdown;
        console.log(`Fetching post for slug: ${slug}`);
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
            console.log(mdblocks)
            console.log(markdown)

            return { 
                post, 
                markdown 
            };
        } catch (error) {
            console.error("Error querying Notion database:", error);
            throw error;
        }
    }

    private static pageToPostTransformer(page: any): BlogPost {
        let cover = page.cover;
        const coverImg = coverImage;
        // console.log("cover:"+JSON.stringify(cover));
        if (!cover) {
            cover = { type: "default", url: coverImg };
        }

        switch (cover.type) {
            case "file":
                cover = page.cover.file.url;
                break;
            case "external":
                cover = page.cover.external.url;
                console.log(cover);
                break;
            default:
                cover = coverImg;
                break;
        }

        return {
            id: page.id,
            cover: cover,
            title:
                page.properties["이름"]?.title?.[0]?.plain_text || "제목 없음",
            tags: page.properties["태그"]?.multi_select || [],
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
        };
    }
}
