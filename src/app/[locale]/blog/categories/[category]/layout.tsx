import { USERNAME } from "@/const";
import { Metadata } from "next";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getAllCategories, getCategoryData } from "@/lib/posts";
import { routing } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { Locale } from "next-intl";

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; locale: Locale }>;
}): Promise<Metadata> {
  const { category, locale } = await params;
  const data = await getCategoryData(locale, category);
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("categoryTitle", {
      category: data.displayName || data.name,
      username: USERNAME,
    }),
    description: t("categoryDescription", {
      category: data.displayName || data.name,
      username: USERNAME,
    }),
  };
}

export default async function CategoriesLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ category: string; locale: string }>;
}>) {
  const { category, locale } = await params;
  const data = await getCategoryData(locale, category);

  return (
    <main className="container flex flex-col py-8 gap-6 px-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/blog">Blog</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>{data.displayName || data.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {children}
    </main>
  );
}
