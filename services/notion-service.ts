import { BlogPost } from "@/@types/schema";
import { Client } from "@notionhq/client";

export default class NotionService {
    client: Client;

    constructor() {
        this.client = new Client({ auth: process.env.NOTION_ACCESS_TOKEN });
    }

    async getPublishedPosts(): Promise<BlogPost[]> {
        const database = process.env.NOTION_BLOG_DATABASE_ID ?? "";

        if (!database) { 
            throw new Error("NOTION_BLOG_DATABASE_ID 환경 변수가 설정되지 않았습니다."); 
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

    private static pageToPostTransformer(page: any): BlogPost {
        let cover = page.cover;
        const coverImg = '/cover.jpg';
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
            title: page.properties['이름']?.title?.[0]?.plain_text || "제목 없음",
            tags: page.properties['태그']?.multi_select || [],
            description: page.properties['설명']?.rich_text?.[0]?.plain_text || "설명 없음",
            created: page.properties['생성일']?.created_time || new Date().toISOString(),
            updated: page.properties['수정일']?.last_edited_time || new Date().toISOString(),
            slug: page.properties['수식']?.formula?.string || "수식 없음",
        };
    }
}
