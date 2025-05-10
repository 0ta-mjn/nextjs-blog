import { getAllCategories, getPosts } from "@/lib/posts";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import PostCardList from "@/components/PostCard";

export const revalidate = false; // 完全 SSG

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((c) => ({
    category: c.name,
  }));
}

export default async function CategoriesPage(props: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await props.params;
  const posts = await getPosts(category);
  return (
    <main className="container flex flex-col py-8 gap-6 px-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/posts">Blog</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <PostCardList posts={posts} />
    </main>
  );
}
