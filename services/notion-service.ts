import { BlogPost, PostPage, Tag } from "@/@types/schema";
import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { cache } from "react";

export const getCachedPublishedPosts = cache(() =>
  new NotionService().getPublishedPosts(),
);

export const getCachedAllTags = cache(() => new NotionService().getAllTags());

export const getCachedTotalPostCount = cache(() =>
  new NotionService().getTotalPostCount(),
);

export const getCachedPostsByTag = cache((tag: string) =>
  new NotionService().getPostsByTag(tag),
);

export const getCachedSingleBlogPost = cache((slug: string) =>
  new NotionService().getSingleBlogPost(slug),
);

const defaultCover = "/cover/webdev.png";

export default class NotionService {
  client: Client;
  n2m: NotionToMarkdown;

  constructor() {
    this.client = new Client({ auth: process.env.NOTION_ACCESS_TOKEN });
    this.n2m = new NotionToMarkdown({ notionClient: this.client });
  }

  private async withRetry<T>(
    fn: () => Promise<T>,
    retries = 5,
    delay = 5000,
  ): Promise<T> {
    try {
      return await fn();
    } catch (error: any) {
      if (error?.code === "rate_limited" && retries > 0) {
        console.log(
          `Rate limited. ${delay}ms 후 재시도... (남은 횟수: ${retries})`,
        );
        await new Promise((res) => setTimeout(res, delay));
        return this.withRetry(fn, retries - 1, delay * 2);
      }
      throw error;
    }
  }

  async getPublishedPosts(): Promise<BlogPost[]> {
    const database = process.env.NOTION_BLOG_DATABASE_ID ?? "";
    if (!database)
      throw new Error(
        "NOTION_BLOG_DATABASE_ID 환경 변수가 설정되지 않았습니다.",
      );

    return this.withRetry(async () => {
      const response = await this.client.databases.query({
        database_id: database,
        filter: { property: "퍼블리시", checkbox: { equals: true } },
        sorts: [{ property: "생성일", direction: "descending" }],
      });
      return response.results.map(NotionService.pageToPostTransformer);
    });
  }

  async getPostsByTag(tag: string): Promise<BlogPost[]> {
    const database = process.env.NOTION_BLOG_DATABASE_ID ?? "";
    if (!database)
      throw new Error(
        "NOTION_BLOG_DATABASE_ID 환경 변수가 설정되지 않았습니다.",
      );

    return this.withRetry(async () => {
      const response = await this.client.databases.query({
        database_id: database,
        filter: { property: "태그", multi_select: { contains: tag } },
        sorts: [{ property: "생성일", direction: "descending" }],
      });
      return response.results.map(NotionService.pageToPostTransformer);
    });
  }

  async getAllTags(): Promise<Tag[]> {
    const database = process.env.NOTION_BLOG_DATABASE_ID ?? "";
    if (!database)
      throw new Error(
        "NOTION_BLOG_DATABASE_ID 환경 변수가 설정되지 않았습니다.",
      );

    return this.withRetry(async () => {
      const response = await this.client.databases.query({
        database_id: database,
        filter: { property: "태그", multi_select: { is_not_empty: true } },
      });

      const tagCounts: {
        [tag: string]: { count: number; color: string; id: string };
      } = {};

      response.results.forEach((res) => {
        if ("properties" in res) {
          const properties = (res as PageObjectResponse).properties;
          if (properties["태그"]?.type === "multi_select") {
            properties["태그"].multi_select.forEach((tag) => {
              const color = tag.color || "#f9f9f9";
              if (tagCounts[tag.name]) {
                tagCounts[tag.name].count++;
              } else {
                tagCounts[tag.name] = { count: 1, color, id: tag.id };
              }
            });
          }
        }
      });

      return Object.entries(tagCounts).map(([name, { count, color, id }]) => ({
        id,
        name,
        count,
        color,
      }));
    });
  }

  async getTotalPostCount(): Promise<number> {
    const database = process.env.NOTION_BLOG_DATABASE_ID ?? "";
    if (!database)
      throw new Error(
        "NOTION_BLOG_DATABASE_ID 환경 변수가 설정되지 않았습니다.",
      );

    return this.withRetry(async () => {
      const response = await this.client.databases.query({
        database_id: database,
        filter: { property: "퍼블리시", checkbox: { equals: true } },
      });
      return response.results.length;
    });
  }

  async getSingleBlogPost(slug: string): Promise<PostPage> {
    if (!slug) throw new Error("Slug parameter is required");

    const database = process.env.NOTION_BLOG_DATABASE_ID ?? "";
    if (!database)
      throw new Error(
        "NOTION_BLOG_DATABASE_ID environment variable is not set",
      );

    return this.withRetry(async () => {
      const response = await this.client.databases.query({
        database_id: database,
        filter: { property: "수식", formula: { string: { equals: slug } } },
        sorts: [{ property: "생성일", direction: "descending" }],
      });

      if (!response.results.length) throw new Error("No results available");

      const page = response.results[0];
      const post = NotionService.pageToPostTransformer(page);
      const mdblocks = await this.n2m.pageToMarkdown(page.id);
      const markdown = this.n2m.toMarkdownString(mdblocks).parent;

      return { post, markdown };
    });
  }

  private static pageToPostTransformer(page: any): BlogPost {
    let cover = page.properties["커버"]?.url || "";
    const tags = page.properties["태그"]?.multi_select || [];

    if (!cover) {
      switch (true) {
        case tags.some((tag) => tag.name === "weekly"):
          cover =
            "https://raw.githubusercontent.com/numi8462/nextjs-blog/main/public/cover/weeklypaper.png";
          break;
        case tags.some((tag) => tag.name === "programmers"):
          cover =
            "https://raw.githubusercontent.com/numi8462/nextjs-blog/main/public/cover/programmers.png";
          break;
        case tags.some((tag) => tag.name === "codeit"):
          cover =
            "https://raw.githubusercontent.com/numi8462/nextjs-blog/main/public/cover/codeit.png";
          break;
        case tags.some((tag) => tag.name === "javascript"):
          cover =
            "https://raw.githubusercontent.com/numi8462/nextjs-blog/main/public/cover/js.jpeg";
          break;
        case tags.some((tag) => tag.name === "typescript"):
          cover =
            "https://raw.githubusercontent.com/numi8462/nextjs-blog/main/public/cover/ts.png";
          break;
        default:
          cover = defaultCover;
          break;
      }
    }

    return {
      id: page.id,
      cover,
      title: page.properties["이름"]?.title?.[0]?.plain_text || "제목 없음",
      tags,
      description:
        page.properties["설명"]?.rich_text?.[0]?.plain_text || "설명 없음",
      created:
        page.properties["생성일"]?.created_time || new Date().toISOString(),
      updated:
        page.properties["수정일"]?.last_edited_time || new Date().toISOString(),
      slug: page.properties["수식"]?.formula?.string || "수식 없음",
    };
  }
}
