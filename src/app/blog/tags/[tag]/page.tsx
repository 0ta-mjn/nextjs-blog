import { getAllTags, getPostsFromTag } from "@/lib/posts";
import { USERNAME } from "@/const";
import PostCardList from "@/components/PostCard";

export const revalidate = false; // 完全 SSG

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((t) => ({
    tag: t,
  }));
}

export default async function TagPage(props: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await props.params;
  const posts = await getPostsFromTag(tag);
  return (
    <main className="container flex flex-col py-8 gap-6 px-4">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold">{USERNAME}&apos;s Blog</h1>

        <p className="text-lg">#{tag}</p>
      </div>

      <PostCardList posts={posts} />
    </main>
  );
}
