import { USERNAME } from "@/const";
import { Metadata } from "next";
import { getAllTags } from "@/lib/posts";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export async function generateStaticParams() {
  const categories = await getAllTags();
  return categories.map((t) => ({
    tag: t,
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
  params: Promise<{ tag: string }>;
}>) {
  const { tag } = await params;

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
            <BreadcrumbPage>#{tag}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {children}
    </main>
  );
}
