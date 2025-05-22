import { MDXRemote } from "next-mdx-remote/rsc"; // MDX の場合
import { getPostSource, getAllPosts } from "@/lib/posts";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { mdxComponents } from "@/lib/mdx-components";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { routing } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { Locale } from "next-intl";
import { USERNAME_SHORT } from "@/const";
import { Metadata } from "next";
import Image from "next/image";
import mermaidPlugin from "mdx-mermaid"; // this might bring commonJS vs ESM problems, I am not 100% sure

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: Locale }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const { post } = await getPostSource(locale, slug);

  const t = await getTranslations({ locale, namespace: "Metadata" });

  const title = t("postTitle", {
    title: post.title,
    username: USERNAME_SHORT,
  });
  const description = post.summary;

  return {
    title,
    description,
    openGraph: {
      type: "article",
      title,
      description,
      images: post.thumbnail
        ? [
            {
              url: post.thumbnail,
              width: 1280,
              height: 720,
              alt: post.title,
            },
          ]
        : undefined,
    },
  };
}

export async function generateStaticParams() {
  return Promise.all(
    routing.locales.map(async (locale) => {
      const { data: posts } = await getAllPosts(locale);
      return posts.map((p) => ({ locale, slug: p.slug }));
    })
  ).then((params) => params.flat());
}

export default async function PostPage(props: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const params = await props.params;
  const { source, post } = await getPostSource(params.locale, params.slug);

  return (
    <main className="container flex flex-col py-8 gap-12 px-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/blog">Blog</BreadcrumbLink>
          </BreadcrumbItem>

          {post.category && (
            <>
              <BreadcrumbSeparator />

              <BreadcrumbItem>
                <BreadcrumbLink href={`/blog/categories/${post.category.name}`}>
                  {/* capitalize */}
                  {post.category.displayName || post.category.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </>
          )}

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>{post.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <article className="post flex flex-col w-full gap-8">
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-3">
            <time dateTime={post.date}>{post.date}</time>
          </div>

          <h1>{post.title}</h1>

          {post.thumbnail && (
            <Image
              src={post.thumbnail}
              alt={post.title}
              width={1024}
              height={576}
              className="w-full aspect-video object-cover rounded-xl"
            />
          )}
        </div>

        <div className="flex w-full flex-col gap-3">
          <MDXRemote
            source={source}
            options={{
              parseFrontmatter: true,
              mdxOptions: {
                rehypePlugins: [rehypeHighlight],
                remarkPlugins: [remarkGfm, mermaidPlugin],
              },
            }}
            components={mdxComponents}
          />
        </div>
      </article>
    </main>
  );
}
