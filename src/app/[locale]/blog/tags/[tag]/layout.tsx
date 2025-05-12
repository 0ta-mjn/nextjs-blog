import { USERNAME } from "@/const";
import { Metadata } from "next";
import { getAllTags } from "@/lib/posts";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { routing } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { Locale } from "next-intl";

export async function generateStaticParams() {
  return Promise.all(
    routing.locales.map(async (locale) => {
      const categories = await getAllTags(locale);
      return categories.map((t) => ({ locale, tag: t }));
    })
  ).then((params) => params.flat());
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string; locale: Locale }>;
}): Promise<Metadata> {
  const { tag, locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("tagTitle", {
      tag,
      username: USERNAME,
    }),
    description: t("tagDescription", {
      tag,
      username: USERNAME,
    }),
  };
}

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
            <BreadcrumbLink href="/blog">Blog</BreadcrumbLink>
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
