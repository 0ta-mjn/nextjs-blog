import { getPostsFromTag } from "@/lib/posts";
import PostCardList from "@/components/PostCard";
import PostPagination from "@/components/PostPagination";
import { BLOG_LIST_PER_PAGE } from "@/const";

export const revalidate = false; // 完全 SSG

export default async function TagPage(props: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await props.params;
  const {
    data: posts,
    hasNextPage,
    total,
  } = await getPostsFromTag(tag, 0, BLOG_LIST_PER_PAGE);

  return (
    <>
      <PostCardList posts={posts} />

      {hasNextPage && (
        <PostPagination
          total={total}
          href={`/blog/tags/${tag}`}
          limit={BLOG_LIST_PER_PAGE}
        />
      )}
    </>
  );
}
