import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "posts");

export type PostMeta = {
  slug: string;
  title: string;
  date: string; // ISO
  tags?: string[];
  summary: string;
};

export async function getAllPosts(): Promise<PostMeta[]> {
  const files = await fs.readdir(POSTS_DIR);
  const posts = await Promise.all(
    files.map<Promise<PostMeta>>(async (file) => {
      const raw = await fs.readFile(path.join(POSTS_DIR, file), "utf8");
      const { data } = matter(raw);
      return {
        slug: file.replace(/\.mdx?$/, ""),
        title: data.title,
        date: data.date,
        tags: data.tags,
        summary: data.summary ?? "",
      };
    })
  );
  // 新しい順
  return posts.sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export async function getPostSource(slug: string) {
  const file = await fs.readFile(path.join(POSTS_DIR, `${slug}.mdx`), "utf8");
  return file;
}
