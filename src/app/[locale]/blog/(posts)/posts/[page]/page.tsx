import { getAllPosts } from "@/lib/posts";
import { BLOG_LIST_PER_PAGE } from "@/const";
import PostCardList from "@/components/PostCard";
import PostPagination from "@/components/PostPagination";
import { routing } from "@/i18n/routing";

export async function generateStaticParams() {
  return Promise.all(
    routing.locales.map(async (locale) => {
      const { data: posts } = await getAllPosts(locale);
      return Array.from(
        { length: Math.ceil(posts.length / BLOG_LIST_PER_PAGE) },
        (_, i) => ({
          locale,
          page: (i + 1).toString(),
        })
      );
    })
  ).then((params) => params.flat());
}

export default async function PostsPage(props: {
  params: Promise<{ page: string; locale: string }>;
}) {
  const { page: p, locale } = await props.params;
  const page = parseInt(p, 10);
  const { data: posts, total } = await getAllPosts(
    locale,
    page,
    BLOG_LIST_PER_PAGE
  );

  return (
    <>
      <PostCardList posts={posts} />

      {total > BLOG_LIST_PER_PAGE && (
        <PostPagination
          total={total}
          href="/blog/posts"
          currentPage={page}
          limit={BLOG_LIST_PER_PAGE}
        />
      )}
    </>
  );
}
