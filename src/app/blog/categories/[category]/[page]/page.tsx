import { getAllCategories, getPosts } from "@/lib/posts";
import { BLOG_LIST_PER_PAGE } from "@/const";
import PostCardList from "@/components/PostCard";
import PostPagination from "@/components/PostPagination";

export async function generateStaticParams() {
  const categories = await getAllCategories();
  const params: { page: string; category: string }[] = [];
  for (const category of categories) {
    const { data: posts } = await getPosts(category.name);
    params.push(
      ...Array.from(
        { length: Math.ceil(posts.length / BLOG_LIST_PER_PAGE) },
        (_, i) => ({
          page: (i + 1).toString(),
          category: category.name,
        })
      )
    );
  }
  return params;
}

export default async function PostsPage(props: {
  params: Promise<{ page: string; category: string }>;
}) {
  const { page: p, category } = await props.params;
  const page = parseInt(p, 10);
  const { data: posts, total } = await getPosts(
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
