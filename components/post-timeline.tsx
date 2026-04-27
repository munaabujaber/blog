/** @format */

import { Category, Post, Type } from "@/prisma/generated/client";
import type { CSSProperties } from "react";
import PostCard from "@/components/post-card";

type TimelinePost = Post & { category: Category | null } & {
  type: Type | null;
  user: {
    name: string;
    id: string;
    image: string | null;
    savedPosts: string[];
  };
};

interface PostTimelineProps {
  posts: TimelinePost[];
  columnVerticalGapRatio?: number;
  cardHeight?: string;
  centerGap?: string;
  desktopTimelineWidth?: string;
}

export default function PostTimeline({
  posts,
  columnVerticalGapRatio = 1 / 3,
  cardHeight = "34rem",
  centerGap = "3rem",
  desktopTimelineWidth = "100%",
}: PostTimelineProps) {
  const leftPosts = posts.filter((_, index) => index % 2 === 0);
  const rightPosts = posts.filter((_, index) => index % 2 === 1);

  return (
    <div
      className="w-full py-8"
      style={
        {
          "--timeline-card-height": cardHeight,
          "--timeline-center-gap": centerGap,
          "--timeline-width": desktopTimelineWidth,
          "--timeline-connector-length": "calc(var(--timeline-center-gap) / 2)",
          "--timeline-marker-size": "0.875rem",
          "--timeline-column-gap-ratio": columnVerticalGapRatio,
          "--timeline-column-gap":
            "calc(var(--timeline-card-height) * var(--timeline-column-gap-ratio))",
          "--timeline-column-offset":
            "calc((var(--timeline-card-height) + var(--timeline-column-gap)) / 2)",
        } as CSSProperties
      }
    >
      <div className="relative mx-auto w-full px-4 md:w-[var(--timeline-width)] md:px-0">
        <div className="absolute left-1/2 top-0 hidden h-full w-0.5 -translate-x-1/2 bg-border md:block" />

        <div className="flex flex-col gap-8 md:hidden">
          {posts.map((post) => (
            <div className="min-h-[var(--timeline-card-height)]" key={post.id}>
              <PostCard post={post} />
            </div>
          ))}
        </div>

        <div className="hidden md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-x-[var(--timeline-center-gap)]">
          <div className="flex flex-col md:gap-[var(--timeline-column-gap)]">
            {leftPosts.map((post) => (
              <div
                className="relative min-h-[var(--timeline-card-height)] md:before:absolute md:before:right-[calc((var(--timeline-connector-length)+var(--timeline-marker-size)/2)*-1)] md:before:top-[calc(var(--timeline-marker-size)/-2)] md:before:z-10 md:before:h-[var(--timeline-marker-size)] md:before:w-[var(--timeline-marker-size)] md:before:rounded-full md:before:border-2 md:before:border-primary md:before:bg-background md:after:absolute md:after:right-[calc(var(--timeline-connector-length)*-1)] md:after:top-0 md:after:h-0.5 md:after:w-[var(--timeline-connector-length)] md:after:bg-border"
                key={post.id}
              >
                <PostCard post={post} />
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-8 md:gap-[var(--timeline-column-gap)] md:pt-[var(--timeline-column-offset)]">
            {rightPosts.map((post) => (
              <div
                className="relative min-h-[var(--timeline-card-height)] md:before:absolute md:before:left-[calc((var(--timeline-connector-length)+var(--timeline-marker-size)/2)*-1)] md:before:top-[calc(var(--timeline-marker-size)/-2)] md:before:z-10 md:before:h-[var(--timeline-marker-size)] md:before:w-[var(--timeline-marker-size)] md:before:rounded-full md:before:border-2 md:before:border-primary md:before:bg-background md:after:absolute md:after:left-[calc(var(--timeline-connector-length)*-1)] md:after:top-0 md:after:h-0.5 md:after:w-[var(--timeline-connector-length)] md:after:bg-border"
                key={post.id}
              >
                <PostCard post={post} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
