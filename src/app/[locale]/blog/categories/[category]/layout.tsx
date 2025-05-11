import { USERNAME } from "@/const";
import { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getAllCategories } from "@/lib/posts";
import { routing } from "@/i18n/routing";

export async function generateStaticParams() {
  return Promise.all(
    routing.locales.map(async (locale) => {
      const categories = await getAllCategories(locale);
      return categories.map((c) => ({
        locale,
        category: c.name,
      }));
    })
  ).then((params) => params.flat());
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
