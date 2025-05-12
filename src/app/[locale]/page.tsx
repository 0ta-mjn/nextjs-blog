import PostCardList from "@/components/PostCard";
import TopTypewriter from "@/app/[locale]/TopTypewriter";
import { Button } from "@/components/ui/button";
import { USERNAME_SHORT } from "@/const";
import { getAllPosts } from "@/lib/posts";
import { Link } from "@/i18n/navigation";
import Logo from "@/components/logo.svg";
import { getTranslations } from "next-intl/server";

const LATEST_POSTS_COUNT = 12; // Number of latest posts to display

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { data: posts, hasNextPage } = await getAllPosts(
    locale,
    0,
    LATEST_POSTS_COUNT
  );

  const t = await getTranslations("Home");

  return (
    <main className="container flex flex-col py-8 gap-6">
      {/* Top Page Hero */}
      <section className="relative flex flex-col items-center text-center gap-8 py-8 px-4 md:py-20 md:px-12 md:gap-12">
        <div className="absolute flex items-center justify-center size-full top-0 left-0 z-0 opacity-20">
          <div className="flex-1 flex items-center justify-center">
            <Logo
              className="w-64 h-64 text-stone-600 md:w-96 md:h-96"
              fill="currentColor"
            />
          </div>
        </div>

        <h1 className="text-5xl font-bold z-10">
          {t("message", {
            username: USERNAME_SHORT,
          })}
        </h1>

        <TopTypewriter />

        <div className="flex items-center justify-center font-bold gap-6 z-10">
          <Link href="/blog">
            <Button size="xl">{t("blog")}</Button>
          </Link>

          <Link href="/about">
            <Button size="xl">{t("whoami")}</Button>
          </Link>
        </div>
      </section>

      {/* Latest Posts */}
      <section className="flex flex-col gap-6 px-4">
        <h2 className="text-2xl font-bold">Latest Posts</h2>

        <PostCardList posts={posts} />

        {hasNextPage && (
          <div className="flex items-center justify-center">
            <Link href="/blog">
              <Button variant="outline" size="xl">
                Read More
              </Button>
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
