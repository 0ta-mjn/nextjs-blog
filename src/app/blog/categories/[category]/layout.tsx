import { USERNAME } from "@/const";
import { Metadata } from "next";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getAllCategories } from "@/lib/posts";

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((c) => ({
    category: c.name,
  }));
}

export const metadata: Metadata = {
  title: ` | ${USERNAME}'s Blog`,
};

export default async function CategoriesLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ category: string }>;
}>) {
  const { category } = await params;

  return (
    <main className="container flex flex-col py-8 gap-6 px-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/blog">Blog</Link>
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

      {children}
    </main>
  );
}
