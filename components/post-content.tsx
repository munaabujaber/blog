/** @format */

"use client";

import ReadOnlyEditor from "@/components/tiptap-templates/simple/read-only-editor";
import PostTableOfContents from "@/components/post-table-of-contents";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

type RecentPost = {
  id: string;
  title: string;
  slug: string;
  imageUrl: string;
  createdAt: Date;
  category: {
    name: string;
  } | null;
};

interface PostContentProps {
  post: {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    imageUrl: string;
    categoryId: string | null;
    tags: string[];
    user: {
      name: string | null;
      image: string | null;
    };
    category: {
      name: string;
    } | null;
  };
  recentPosts: RecentPost[];
}

function RecentPostsList({ posts }: { posts: RecentPost[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="hidden rounded-md border bg-background/85 p-4 shadow-sm backdrop-blur lg:block">
      <h2 className="mb-3 text-sm font-semibold">Recent posts</h2>
      <div className="space-y-3">
        {posts.map((recentPost) => (
          <Link
            href={`/blog/posts/${recentPost.slug}`}
            key={recentPost.id}
            className="group grid grid-cols-[5rem_minmax(0,1fr)] gap-3 rounded-md p-1 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-muted">
              <Image
                src={recentPost.imageUrl}
                alt={recentPost.title}
                fill
                className="object-cover transition duration-200 group-hover:scale-105"
                sizes="80px"
              />
            </div>
            <div className="min-w-0">
              <p className="line-clamp-2 text-sm font-medium leading-snug transition group-hover:text-primary">
                {recentPost.title}
              </p>
              <div className="mt-1 flex min-w-0 flex-col gap-0.5 text-xs text-muted-foreground">
                {recentPost.category && (
                  <span className="truncate">{recentPost.category.name}</span>
                )}
                <time dateTime={new Date(recentPost.createdAt).toISOString()}>
                  {format(new Date(recentPost.createdAt), "MM/dd/yyyy")}
                </time>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function PostContent({ post, recentPosts }: PostContentProps) {
  const articleRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-7xl gap-x-10 gap-y-6 lg:grid-cols-[minmax(0,860px)_18rem] lg:items-start">
        <article className="min-w-0 lg:col-start-1 lg:row-start-1">
          <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="relative h-9 w-9 rounded-full shadow-lg">
                <Image
                  src={post.user.image!}
                  alt={post.user.name || "User"}
                  className="rounded-full object-cover shadow-lg"
                  fill
                  sizes="36px"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium">{post.user.name}</span>
                <span className="text-xs font-medium text-muted-foreground">
                  {format(new Date(post.createdAt), "MM/dd/yyyy")}
                </span>
              </div>

              {post.category && (
                <Link
                  href={`/blog/category/${post.categoryId}`}
                  className="rounded-md bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80"
                >
                  {post.category.name}
                </Link>
              )}
            </div>
            <div className="relative h-72 w-full overflow-hidden rounded-md sm:h-96">
              <Image
                src={post.imageUrl}
                alt={post.title}
                className="object-cover"
                fill
                sizes="(max-width: 1024px) 100vw, 860px"
                priority
              />
            </div>
          </div>
        </article>

        <div className="space-y-4 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <RecentPostsList posts={recentPosts} />
          <PostTableOfContents articleRef={articleRef} />
        </div>

        <div
          ref={articleRef}
          className="min-w-0 lg:col-start-1 lg:row-start-2"
        >
          <ReadOnlyEditor
            content={post.content}
            width="100%"
            height="auto"
            maxWidth="860px"
          />

          <div className="flex flex-wrap gap-2 py-6">
            {post.tags.map((tag) => (
              <Link href={`/blog/tag/${tag}`} key={tag}>
                <Badge variant="secondary">#{tag}</Badge>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
