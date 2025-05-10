import { getAllCategories, getAllPosts } from "@/lib/posts";
import { USERNAME } from "@/const";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import PostCardList from "@/components/PostCard";

export const revalidate = false; // 完全 SSG

export default async function PostsPage() {
  const posts = await getAllPosts();
  const categories = await getAllCategories();

  return (
    <main className="container flex flex-col py-8 gap-6 px-4">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold">{USERNAME}&apos;s Blog</h1>
      </div>

      <div className="flex items-center gap-3">
        {categories.map((c) => (
          <Link
            key={c.name}
            href={`/blog/categories/${c.name}`}
            className="text-sm text-muted-foreground hover:underline"
          >
            <Button variant="default">
              {c.name} ({c.postCount})
            </Button>
          </Link>
        ))}
      </div>

      <PostCardList posts={posts} />
    </main>
  );
}
