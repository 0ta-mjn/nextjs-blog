import { getAllPosts } from "@/lib/posts";
import { BLOG_LIST_PER_PAGE } from "@/const";
import PostCardList from "@/components/PostCard";
import PostPagination from "@/components/PostPagination";

export async function generateStaticParams() {
  const { data: posts } = await getAllPosts();
  return [
    ...Array.from(
      { length: Math.ceil(posts.length / BLOG_LIST_PER_PAGE) },
      (_, i) => ({
        page: (i + 1).toString(),
      })
    ),
  ];
}

export default async function PostsPage(props: {
  params: Promise<{ page: string }>;
}) {
  const { page: p } = await props.params;
  const page = parseInt(p, 10);
  const { data: posts, total } = await getAllPosts(page, BLOG_LIST_PER_PAGE);

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
