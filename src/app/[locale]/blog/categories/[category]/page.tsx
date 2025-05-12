import { getPosts } from "@/lib/posts";
import PostCardList from "@/components/PostCard";
import PostPagination from "@/components/PostPagination";
import { BLOG_LIST_PER_PAGE } from "@/const";

export default async function CategoriesPage(props: {
  params: Promise<{ category: string; locale: string }>;
}) {
  const { category, locale } = await props.params;
  const {
    data: posts,
    hasNextPage,
    total,
  } = await getPosts(locale, category, 0, BLOG_LIST_PER_PAGE);

  return (
    <>
      <PostCardList posts={posts} />

      {hasNextPage && (
        <PostPagination
          total={total}
          href={`/blog/categories/${category}`}
          limit={BLOG_LIST_PER_PAGE}
        />
      )}
    </>
  );
}
