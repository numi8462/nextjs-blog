import { BlogPost, PostPage, Tag } from "@/@types/schema";
import { APIErrorCode, Client, isNotionClientError } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { cache } from "react";

const defaultCover =
  "https://raw.githubusercontent.com/numi8462/nextjs-blog/main/public/cover/webdev.png";

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
    } catch (error) {
      if (
        isNotionClientError(error) &&
        error.code === APIErrorCode.RateLimited &&
        retries > 0
      ) {
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

export const getCachedPublishedPosts = cache(() =>
  new NotionService().getPublishedPosts(),
);

export const getCachedAllTags = cache(async (): Promise<Tag[]> => {
  const posts = await getCachedPublishedPosts(); // 별도 API 호출 없이 재활용

  const tagCounts: {
    [tag: string]: { count: number; color: string; id: string };
  } = {};

  posts.forEach((post) => {
    post.tags.forEach((tag: any) => {
      if (tagCounts[tag.name]) {
        tagCounts[tag.name].count++;
      } else {
        tagCounts[tag.name] = {
          count: 1,
          color: tag.color || "#f9f9f9",
          id: tag.id,
        };
      }
    });
  });

  return Object.entries(tagCounts).map(([name, { count, color, id }]) => ({
    id,
    name,
    count,
    color,
  }));
});

export const getCachedTotalPostCount = cache(async (): Promise<number> => {
  const posts = await getCachedPublishedPosts();
  return posts.length;
});

export const getCachedPostsByTag = cache((tag: string) =>
  new NotionService().getPostsByTag(tag),
);

export const getCachedSingleBlogPost = cache((slug: string) =>
  new NotionService().getSingleBlogPost(slug),
);
