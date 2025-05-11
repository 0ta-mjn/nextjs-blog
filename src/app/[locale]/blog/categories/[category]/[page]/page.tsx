import { getAllCategories, getPosts } from "@/lib/posts";
import { BLOG_LIST_PER_PAGE } from "@/const";
import PostCardList from "@/components/PostCard";
import PostPagination from "@/components/PostPagination";
import { routing } from "@/i18n/routing";

export async function generateStaticParams() {
  return Promise.all(
    routing.locales.map(async (locale) => {
      const categories = await getAllCategories(locale);
      return Promise.all(
        categories.map(async (category) => {
          const { data: posts } = await getPosts(category.name);
          return Array.from(
            { length: Math.ceil(posts.length / BLOG_LIST_PER_PAGE) },
            (_, i) => ({
              locale,
              page: (i + 1).toString(),
              category: category.name,
            })
          );
        })
      ).then((params) => params.flat());
    })
  ).then((params) => params.flat());
}

export default async function PostsPage(props: {
  params: Promise<{ page: string; category: string; locale: string }>;
}) {
  const { page: p, category, locale } = await props.params;
  const page = parseInt(p, 10);
  const { data: posts, total } = await getPosts(
    locale,
    category,
    page,
    BLOG_LIST_PER_PAGE
  );

  return (
    <>
      <PostCardList posts={posts} />

      {total > BLOG_LIST_PER_PAGE && (
        <PostPagination
          total={total}
          href={`/blog/categories/${category}`}
          currentPage={page}
          limit={BLOG_LIST_PER_PAGE}
        />
      )}
    </>
  );
}
