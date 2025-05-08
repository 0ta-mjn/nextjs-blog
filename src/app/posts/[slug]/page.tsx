import { compileMDX } from "next-mdx-remote/rsc"; // MDX の場合
import { getPostSource, getAllPosts, PostMeta } from "@/lib/posts";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function PostPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const source = await getPostSource(params.slug);
  const { content, frontmatter } = await compileMDX<PostMeta>({
    source,
    options: { parseFrontmatter: true },
  });

  return (
    <article className="prose mx-auto py-10">
      <h1>{frontmatter.title}</h1>
      <time dateTime={frontmatter.date}>
        {new Date(frontmatter.date).toLocaleDateString()}
      </time>
      {content}
    </article>
  );
}
