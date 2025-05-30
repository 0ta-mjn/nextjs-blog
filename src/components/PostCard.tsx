"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Link, useRouter } from "@/i18n/navigation";
import { PostMeta } from "@/lib/posts";
import Image from "next/image";
import { Image as ImageIcon } from "lucide-react";

export default function PostCardList({ posts }: { posts: PostMeta[] }) {
  return posts.length > 0 ? (
    <ul className="grid w-full gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {posts.map((p) => (
        <li key={p.slug}>
          <PostCard post={p} />
        </li>
      ))}
    </ul>
  ) : (
    <div className="flex items-center">
      <p className="text-muted-foreground text-lg">No posts found</p>
    </div>
  );
}

function PostCard({ post }: { post: PostMeta }) {
  const router = useRouter();
  return (
    <Card
      className="size-full cursor-pointer hover:border-2"
      onClick={() => router.push(`/blog/${post.slug}`)}
      style={{ paddingTop: 0 }}
    >
      {post.thumbnail ? (
        <Image
          width={500}
          height={300}
          src={post.thumbnail}
          alt={post.title}
          className="w-full aspect-video object-cover rounded-t-xl"
        />
      ) : (
        <div className="flex items-center justify-center w-full aspect-video bg-stone-200 rounded-t-xl dark:bg-stone-600">
          <ImageIcon className="size-16 text-muted-foreground" size={48} />
        </div>
      )}

      <CardHeader className="flex flex-col">
        <CardTitle>{post.title}</CardTitle>
        <CardDescription>{post.date}</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-3">
        <p className="w-full line-clamp-3 flex-1">{post.summary}</p>
      </CardContent>

      {(!!post.tags?.length || !!post.category) && (
        <CardFooter className="flex items-center gap-3">
          {post.category && (
            <Link
              href={`/blog/categories/${post.category.name}`}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Button variant="outline" size="sm">
                {post.category.displayName || post.category.name}
              </Button>
            </Link>
          )}

          {post.tags?.map((tag) => (
            <Link
              href={`/blog/tags/${tag}`}
              key={tag}
              className="text-sm text-muted-foreground hover:underline"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Button variant="link" size="sm">
                #{tag}
              </Button>
            </Link>
          ))}
        </CardFooter>
      )}
    </Card>
  );
}
