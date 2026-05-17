/** @format */

"use client";

import ReadOnlyEditor from "@/components/tiptap-templates/simple/read-only-editor";
import PostTableOfContents from "@/components/post-table-of-contents";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

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
}

export default function PostContent({ post }: PostContentProps) {
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

        <PostTableOfContents
          articleRef={articleRef}
          className="lg:col-start-2 lg:row-span-2 lg:row-start-1"
        />

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
