import { BlogPost } from "@/@types/schema";
import { Client } from "@notionhq/client";
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

        // list blog posts
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
    }

    private static pageToPostTransformer(page: any): BlogPost {
        let cover = page.cover;
    
        if (!cover) {
            cover = { type: "default", url: "" };
        }
    
        switch (cover.type) {
            case "file":
                cover = page.cover.file;
                break;
            case "external":
                cover = page.cover.external.url;
                break;
            default:
                cover = "";
        }
    
        return {
            id: page.id,
            cover: cover,
            title: page.properties['이름']?.title?.[0]?.plain_text || "제목 없음",
            tags: page.properties['태그']?.multi_select || [],
            description: page.properties['설명']?.rich_text?.[0]?.plain_text || "설명 없음",
            created: page.properties['생성일'].created_time,
            updated: page.properties['수정일'].last_edited_time,
            slug: page.properties['수식']?.formula?.string || "수식 없음",
        };
    }
    
}
