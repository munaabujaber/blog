/** @format */

"use client";

import { Category, Post, Type } from "@/prisma/generated/client";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface PostProps {
  post: Post & { category: Category | null } & {
    type: Type | null;
    user: {
      name: string;
      id: string;
      image: string | null;
      savedPosts: string[];
    };
  };
}

export default function PostCard({ post }: PostProps) {
  return (
    <Link
      href={`/blog/posts/${post.slug}`}
      className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <Card className="h-full w-full gap-4 rounded-lg border-0 p-4 shadow-md transition duration-200 group-hover:-translate-y-0.5 group-hover:shadow-lg">
        <div className="grid grid-cols-2 gap-3 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          <span className="truncate text-left">
            {post.category?.name ?? "Uncategorized"}
          </span>
          <span className="truncate text-right">{post.type?.name ?? "Post"}</span>
        </div>

        <div className="relative aspect-[3/2] w-full overflow-hidden rounded-md bg-muted">
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </div>

        <CardContent className="flex flex-1 flex-col gap-3 px-0">
          <div className="grid grid-cols-2 items-center gap-3 text-[11px] font-medium text-muted-foreground">
            <div className="flex min-w-0 items-center gap-2">
              {post.user.image && (
                <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full">
                  <Image
                    className="object-cover"
                    src={post.user.image}
                    alt={post.user.name}
                    fill
                    sizes="28px"
                  />
                </div>
              )}
              <span className="truncate">{post.user.name}</span>
            </div>
            <span className="truncate text-right">
              {format(post.createdAt, "dd/MM/yyyy")}
            </span>
          </div>

          <CardHeader className="gap-0 px-0">
            <CardTitle className="line-clamp-3 text-base font-semibold leading-snug transition group-hover:text-primary">
              {post.title}
            </CardTitle>
          </CardHeader>

          <p className="line-clamp-3 text-sm text-muted-foreground">
            {post.description}
          </p>

          {post.tags.length > 0 && (
            <div className="mt-auto flex flex-wrap gap-2 pt-2">
              {post.tags.map((tag) => (
                <Badge variant="secondary" key={tag} className="max-w-full">
                  <span className="truncate">#{tag}</span>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
