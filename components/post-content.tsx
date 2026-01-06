/** @format */

"use client";

import ReadOnlyEditor from "@/components/tiptap-templates/simple/read-only-editor";
import { Badge } from "@/components/ui/badge";
import { Editor } from "@tiptap/react";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

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
  const [editor, setEditor] = useState<Editor | null>(null);

  return (
    <div className="w-full flex flex-col items-center p-6 md:p-0">
      <div className="flex max-w-6xl flex-col gap-6 justify-center">
        <h1 className="text-2xl md:text-5xl font-semibold">{post.title}</h1>
        <div className="flex gap-6 text-sm">
          <div className="flex gap-6">
            <div className="relative h-8 w-8 rounded-full shadow-lg">
              <Image
                src={post.user.image!}
                alt={post.user.name || "User"}
                className="rounded-full shadow-lg"
                fill
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sx font-medium">{post.user.name}</span>
              <span className="text-xs text-neutral-500 font-medium">
                {format(new Date(post.createdAt), "MM/dd/yyyy")}
              </span>
            </div>

            {post.category && (
              <Link
                href={`/blog/category/${post.categoryId}`}
                className="font-semibold"
              >
                {post.category.name}
              </Link>
            )}
          </div>
        </div>
        <div className="relative h-80 w-full">
          <Image
            src={post.imageUrl}
            alt={post.title}
            className="rounded-sm object-cover"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        <ReadOnlyEditor content={post.content} />

        <div className="flex gap-2 py-6 flex-wrap">
          {post.tags.map((tag) => (
            <Link href={`/blog/tag/${tag}`} key={tag}>
              <Badge variant="secondary">#{tag}</Badge>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
