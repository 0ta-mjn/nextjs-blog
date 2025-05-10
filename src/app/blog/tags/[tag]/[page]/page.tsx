import { getAllTags, getPostsFromTag } from "@/lib/posts";
import { BLOG_LIST_PER_PAGE } from "@/const";
import PostCardList from "@/components/PostCard";
import PostPagination from "@/components/PostPagination";

export async function generateStaticParams() {
  const tags = await getAllTags();
  const params: { page: string; tag: string }[] = [];
  for (const tag of tags) {
    const { data: posts } = await getPostsFromTag(tag);
    params.push(
      ...Array.from(
        { length: Math.ceil(posts.length / BLOG_LIST_PER_PAGE) },
        (_, i) => ({
          page: (i + 1).toString(),
          tag: tag,
        })
      )
    );
  }
  return params;
}

export default async function PostsPage(props: {
  params: Promise<{ page: string; tag: string }>;
}) {
  const { page: p, tag } = await props.params;
  const page = parseInt(p, 10);
  const { data: posts, total } = await getPostsFromTag(
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
