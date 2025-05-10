import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import dayjs from "dayjs";

const POSTS_DIR = path.join(process.cwd(), "posts");

export type PostFrontmatter = {
  title: string;
  date: string; // ISO
  tags?: string[];
  summary: string;
};

export type PostMeta = {
  slug: string;
  path: string;
  category?: string;
} & PostFrontmatter;

const sortByDate = (posts: PostMeta[]) =>
  posts.sort((a, b) => dayjs(b.date).diff(dayjs(a.date)));

type PostListResult = {
  data: PostMeta[];
  hasNextPage: boolean;
  total: number;
};

export async function getAllPosts(
  page?: number,
  limit?: number
): Promise<PostListResult> {
  const { data: posts } = await getPosts();

  const categories = await getAllCategories();
  for (const category of categories) {
    const { data: postsInCategory } = await getPosts(category.name);
    posts.push(...postsInCategory);
  }

  let result = sortByDate(posts);

  result =
    page != undefined && limit != undefined
      ? result.slice(page * limit, (page + 1) * limit)
      : result;

  return {
    data: result,
    hasNextPage:
      page != undefined && limit != undefined
        ? posts.length > (page + 1) * limit
        : false,
    total: posts.length,
  };
}

export async function getPosts(
  category?: string,
  page?: number,
  limit?: number
): Promise<PostListResult> {
  const dir = category
    ? path.join(POSTS_DIR, category.replace(/^\//, ""))
    : POSTS_DIR;
  const files = await fs.readdir(dir);
  const filesFiltered = files.filter(
    (f) => f.endsWith(".md") || f.endsWith(".mdx")
  );
  const posts = await Promise.all(
    filesFiltered.map<Promise<PostMeta>>(async (file) => {
      const filename = path.join(dir, file);
      const raw = await fs.readFile(filename, "utf8");
      const { data } = matter(raw);
      return {
        path: filename,
        slug: file.replace(/\.mdx?$/, ""),
        title: data.title,
        date: data.date,
        category: category,
        tags: data.tags,
        summary: data.summary ?? "",
      };
    })
  );

  let result = sortByDate(posts);
  result =
    page != undefined && limit != undefined
      ? result.slice(page * limit, (page + 1) * limit)
      : result;

  return {
    data: result,
    hasNextPage:
      page != undefined && limit != undefined
        ? posts.length > (page + 1) * limit
        : false,
    total: posts.length,
  };
}

export async function getPostsFromTag(
  tag: string,
  page?: number,
  limit?: number
): Promise<PostListResult> {
  const { data } = await getAllPosts();
  const posts = data.filter((p) => p.tags?.includes(tag));
  const result =
    page != undefined && limit != undefined
      ? posts.slice(page * limit, (page + 1) * limit)
      : posts;
  return {
    data: result,
    hasNextPage:
      page != undefined && limit != undefined
        ? posts.length > (page + 1) * limit
        : false,
    total: posts.length,
  };
}

export type CategoryData = {
  name: string;
  postCount: number;
  latestPost: PostMeta | null;
};

export async function getAllCategories(): Promise<CategoryData[]> {
  const files = await fs.readdir(POSTS_DIR);
  const categories = files
    .filter((f) => !f.includes("."))
    .map((f) => f.replace(POSTS_DIR, "").replace(/^\//, ""));
  const categoryMap = new Map<string, CategoryData>();
  for (const category of categories) {
    const { data: posts } = await getPosts(category);
    const latestPost = posts[0] ?? null;
    categoryMap.set(category, {
      name: category,
      postCount: posts.length,
      latestPost,
    });
  }
  const result = Array.from(categoryMap.values());
  result.sort((a, b) => a.name.localeCompare(b.name));
  return result;
}

export async function getAllTags(): Promise<string[]> {
  const { data: posts } = await getAllPosts();
  const tags = posts.reduce<string[]>((acc, { tags = [] }) => {
    for (const tag of tags) {
      if (!acc.includes(tag)) {
        acc.push(tag);
      }
    }
    return acc;
  }, [] as string[]);

  tags.sort((a, b) => a.localeCompare(b));

  return tags;
}

export async function getPost(slug: string): Promise<PostMeta> {
  const { data: posts } = await getAllPosts();
  const post = posts.find((p) => p.slug === slug);
  if (!post) {
    throw new Error(`Post not found: ${slug}`);
  }
  return post;
}

export async function getPostSource(slug: string) {
  const post = await getPost(slug);
  const source = await fs.readFile(post.path, "utf8");
  return { source, post };
}
