import { getAllPosts } from "@/lib/posts";
import PostCardList from "@/components/PostCard";
import PostPagination from "@/components/PostPagination";
import { BLOG_LIST_PER_PAGE } from "@/const";

export default async function PostsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const {
    data: posts,
    hasNextPage,
    total,
  } = await getAllPosts(locale, 0, BLOG_LIST_PER_PAGE);

  return (
    <>
      <PostCardList posts={posts} />

      {hasNextPage && (
        <PostPagination
          total={total}
          href="/blog/posts"
          limit={BLOG_LIST_PER_PAGE}
        />
      )}
    </>
  );
}
