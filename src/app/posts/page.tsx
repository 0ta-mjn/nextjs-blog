import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export const revalidate = false; // 完全 SSG

export default async function IndexPage() {
  const posts = await getAllPosts();
  return (
    <section className="mx-auto max-w-2xl py-10">
      <h1 className="text-3xl font-bold mb-6">Blog</h1>
      <ul className="space-y-4">
        {posts.map((p) => (
          <li key={p.slug}>
            <Link href={`/posts/${p.slug}`} className="text-blue-600 underline">
              {p.title}
            </Link>
            <small className="block text-gray-500">
              {new Date(p.date).toLocaleDateString()} – {p.summary}
            </small>
          </li>
        ))}
      </ul>
    </section>
  );
}
