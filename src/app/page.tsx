import PostCardList from "@/components/PostCard";
import TopTypewriter from "@/components/TopTypewriter";
import { Button } from "@/components/ui/button";
import { SITE_TITLE } from "@/const";
import { getAllPosts } from "@/lib/posts";
import Link from "next/link";

const LATEST_POSTS_COUNT = 12; // Number of latest posts to display

export default async function Home() {
  const { data: posts, hasNextPage } = await getAllPosts(0, LATEST_POSTS_COUNT);

  return (
    <main className="container flex flex-col py-8 gap-6">
      {/* Top Page Hero */}
      <section className="flex flex-col items-center text-center gap-3 py-8 px-4 md:py-20 md:px-12 md:gap-12">
        <h1 className="text-5xl font-bold">Welcome to {SITE_TITLE}</h1>

        <TopTypewriter />

        <div className="flex items-center justify-center font-bold gap-6">
          <Link href="/blog">
            <Button size="xl">Blog</Button>
          </Link>

          <Link href="/about">
            <Button size="xl">About</Button>
          </Link>
        </div>
      </section>

      {/* Latest Posts */}
      <section className="flex flex-col gap-6 px-4">
        <h2 className="text-2xl font-bold">Latest Posts</h2>

        <PostCardList posts={posts} />

        {hasNextPage && (
          <div className="flex items-center justify-center">
            <Link href="/blog">
              <Button variant="outline" size="xl">
                Read More
              </Button>
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
