import { getAllPosts } from "@/lib/posts";
import Link from "next/link";

export default async function Home() {
  const posts = await getAllPosts();

  return (
    <section className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <section className="mx-auto max-w-2xl py-10">
        <h1 className="text-3xl font-bold mb-6">Blog</h1>
        <ul className="space-y-4">
          {posts.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/posts/${p.slug}`}
                className="text-blue-600 underline"
              >
                {p.title}
              </Link>
              <small className="block text-gray-500">
                {new Date(p.date).toLocaleDateString()} – {p.summary}
              </small>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}
