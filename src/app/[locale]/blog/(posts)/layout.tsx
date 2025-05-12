import { Button } from "@/components/ui/button";
import { USERNAME } from "@/const";
import { getAllCategories } from "@/lib/posts";
import { Link } from "@/i18n/navigation";

export default async function PostsLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const categories = await getAllCategories(locale);

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
              {c.displayName} ({c.postCount})
            </Button>
          </Link>
        ))}
      </div>

      {children}
    </main>
  );
}
