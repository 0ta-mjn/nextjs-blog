import { getAllTags, getPostsFromTag } from "@/lib/posts";
import { BLOG_LIST_PER_PAGE } from "@/const";
import PostCardList from "@/components/PostCard";
import PostPagination from "@/components/PostPagination";
import { routing } from "@/i18n/routing";

export async function generateStaticParams() {
  return Promise.all(
    routing.locales.map(async (locale) => {
      const tags = await getAllTags(locale);
      return Promise.all(
        tags.map(async (tag) => {
          const { data: posts } = await getPostsFromTag(locale, tag);
          return Array.from(
            { length: Math.ceil(posts.length / BLOG_LIST_PER_PAGE) },
            (_, i) => ({
              locale,
              page: (i + 1).toString(),
              tag: tag,
            })
          );
        })
      ).then((params) => params.flat());
    })
  ).then((params) => params.flat());
}

export default async function PostsPage(props: {
  params: Promise<{ page: string; tag: string; locale: string }>;
}) {
  const { page: p, tag, locale } = await props.params;
  const page = parseInt(p, 10);
  const { data: posts, total } = await getPostsFromTag(
    locale,
    tag,
    page,
    BLOG_LIST_PER_PAGE
  );

  return (
    <>
      <PostCardList posts={posts} />

      {total > BLOG_LIST_PER_PAGE && (
        <PostPagination
          total={total}
          href={`/blog/tags/${tag}`}
          currentPage={page}
          limit={BLOG_LIST_PER_PAGE}
        />
      )}
    </>
  );
}
