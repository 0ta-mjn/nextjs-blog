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
  thumbnail?: string;
};

export type PostMeta = {
  slug: string;
  path: string;
  category?: { name: string; displayName?: string };
} & PostFrontmatter;

const sortByDate = (posts: PostMeta[]) =>
  posts.sort((a, b) => dayjs(b.date).diff(dayjs(a.date)));

type PostListResult = {
  data: PostMeta[];
  hasNextPage: boolean;
  total: number;
};

export async function getAllPosts(
  lang: string,
  page?: number,
  limit?: number
): Promise<PostListResult> {
  const { data: posts } = await getPosts(lang);

  const categories = await getAllCategories(lang);
  for (const category of categories) {
    const { data: postsInCategory } = await getPosts(lang, category.name);
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
  lang: string,
  category?: string,
  page?: number,
  limit?: number
): Promise<PostListResult> {
  const dir = category
    ? path.join(POSTS_DIR, category.replace(/^\//, ""))
    : POSTS_DIR;
  const files = await fs.readdir(dir);
  const filesFiltered = files.filter(
    (f) => (f.endsWith(".md") || f.endsWith(".mdx")) && f.includes(`.${lang}.`)
  );
  let categoryData: { name: string; displayName?: string } | undefined =
    undefined;
  if (category) {
    categoryData = await getCategoryData(lang, category);
  }
  const posts = await Promise.all(
    filesFiltered.map<Promise<PostMeta>>(async (file) => {
      const filename = path.join(dir, file);
      const raw = await fs.readFile(filename, "utf8");
      const { data } = matter(raw);
      return {
        path: filename,
        slug: file.replace(/\.mdx?$/, "").replace(`.${lang}`, ""),
        title: data.title,
        date: data.date,
        category: categoryData,
        tags: data.tags,
        summary: data.summary ?? "",
        thumbnail: data.thumbnail,
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
  lang: string,
  tag: string,
  page?: number,
  limit?: number
): Promise<PostListResult> {
  const { data } = await getAllPosts(lang);
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
  displayName?: string;
  postCount: number;
  latestPost: PostMeta | null;
};

export async function getAllCategories(lang: string): Promise<CategoryData[]> {
  const files = await fs.readdir(POSTS_DIR);
  const categories = files
    .filter((f) => !f.includes("."))
    .map((f) => f.replace(POSTS_DIR, "").replace(/^\//, ""));
  const categoryMap = new Map<string, CategoryData>();
  for (const category of categories) {
    const { data: posts } = await getPosts(lang, category);
    if (posts.length === 0) {
      continue;
    }
    const data = await getCategoryData(lang, category);
    const latestPost = posts[0] ?? null;
    categoryMap.set(category, {
      ...data,
      postCount: posts.length,
      latestPost,
    });
  }
  const result = Array.from(categoryMap.values());
  result.sort((a, b) => a.name.localeCompare(b.name));
  return result;
}

export async function getCategoryData(lang: string, name: string) {
  try {
    const file = await fs.readFile(
      path.join(POSTS_DIR, name.replace(/^\//, ""), "category.json"),
      "utf8"
    );
    const data = JSON.parse(file)[lang];
    if (!data) {
      throw new Error(`Category not found: ${name}`);
    }
    return { name, displayName: data.name };
  } catch (error) {
    console.error(`Error reading category data for ${name}:`, error);
    return { name: name };
  }
}

export async function getAllTags(lang: string): Promise<string[]> {
  const { data: posts } = await getAllPosts(lang);
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

export async function getPost(lang: string, slug: string): Promise<PostMeta> {
  const { data: posts } = await getAllPosts(lang);
  const post = posts.find((p) => p.slug === slug);
  if (!post) {
    throw new Error(`Post not found: ${slug}`);
  }
  return post;
}

export async function getPostSource(lang: string, slug: string) {
  const post = await getPost(lang, slug);
  const source = await fs.readFile(post.path, "utf8");
  return { source, post };
}
