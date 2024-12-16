export type Tag = {
  count: ReactNode;
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
  likes: number;
};

export type PostPage = {
  post: BlogPost,
  markdown: string
}

export type Tag = {
  name: string,
  count: number,
  id: string,
  color: string
}