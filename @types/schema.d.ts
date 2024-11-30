export type Tag = {
  color: string;
  id: string;
  name: string;
};

export type BlogPost = {
  id: string;
  cover: string;
  slug: string;
  title: string;
  tags: Tag[];
  description: string;
  updated: string;
  created: string;
};

export type PostPage = {
  post: BlogPost,
  markdown: string
}