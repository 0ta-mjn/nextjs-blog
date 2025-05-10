import { Button } from "@/components/ui/button";
import { USERNAME } from "@/const";
import { getAllCategories } from "@/lib/posts";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: `${USERNAME}'s Blog`,
  description: "A blog about my tech journey",
};

export default async function PostsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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

      {children}
    </main>
  );
}
