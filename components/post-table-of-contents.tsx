/** @format */

"use client";

import { ChevronDown, ListTree } from "lucide-react";
import { useCallback, useEffect, useId, useState } from "react";
import type { RefObject } from "react";

import { cn } from "@/lib/utils";

type HeadingItem = {
  id: string;
  level: number;
  text: string;
};

type PostTableOfContentsProps = {
  articleRef: RefObject<HTMLDivElement | null>;
  className?: string;
};

const HEADING_SELECTOR = "h1, h2, h3, h4, h5, h6";
const SCROLL_OFFSET = 96;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function slugifyHeading(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function headingsAreEqual(current: HeadingItem[], next: HeadingItem[]) {
  if (current.length !== next.length) return false;

  return current.every((item, index) => {
    const nextItem = next[index];
    return (
      item.id === nextItem.id &&
      item.level === nextItem.level &&
      item.text === nextItem.text
    );
  });
}

function findHeadingById(article: HTMLElement, id: string) {
  return Array.from(
    article.querySelectorAll<HTMLHeadingElement>(HEADING_SELECTOR),
  ).find((heading) => heading.id === id);
}

function TocItems({
  activeId,
  headings,
  onNavigate,
}: {
  activeId: string;
  headings: HeadingItem[];
  onNavigate: (id: string) => void;
}) {
  return (
    <ul className="space-y-1">
      {headings.map((heading) => {
        const isActive = heading.id === activeId;

        return (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "block rounded-md py-1.5 pr-2 text-sm leading-snug text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive && "bg-accent text-foreground",
              )}
              style={{
                paddingLeft: `${0.5 + Math.max(heading.level - 1, 0) * 0.75}rem`,
              }}
              onClick={(event) => {
                event.preventDefault();
                onNavigate(heading.id);
              }}
            >
              {heading.text}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export default function PostTableOfContents({
  articleRef,
  className,
}: PostTableOfContentsProps) {
  const contentId = useId();
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const [activeId, setActiveId] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [progress, setProgress] = useState(0);

  const collectHeadings = useCallback(() => {
    const article = articleRef.current;
    if (!article) return;

    const usedIds = new Set<string>();
    const slugCounts = new Map<string, number>();
    const nextHeadings = Array.from(
      article.querySelectorAll<HTMLHeadingElement>(HEADING_SELECTOR),
    )
      .map((heading, index) => {
        const text = heading.textContent?.replace(/\s+/g, " ").trim() ?? "";
        if (!text) return null;

        const level = Number(heading.tagName.replace("H", ""));
        const baseId = heading.id || slugifyHeading(text) || `section-${index + 1}`;
        const count = slugCounts.get(baseId) ?? 0;
        slugCounts.set(baseId, count + 1);

        let id = count > 0 && !heading.id ? `${baseId}-${count + 1}` : baseId;
        let collisionIndex = 2;
        while (usedIds.has(id)) {
          id = `${baseId}-${collisionIndex}`;
          collisionIndex += 1;
        }

        heading.id = id;
        heading.style.scrollMarginTop = "6rem";
        usedIds.add(id);

        return { id, level, text };
      })
      .filter((heading): heading is HeadingItem => Boolean(heading));

    setHeadings((currentHeadings) =>
      headingsAreEqual(currentHeadings, nextHeadings)
        ? currentHeadings
        : nextHeadings,
    );

    setActiveId((currentActiveId) => {
      if (
        currentActiveId &&
        nextHeadings.some((heading) => heading.id === currentActiveId)
      ) {
        return currentActiveId;
      }

      return nextHeadings[0]?.id ?? "";
    });
  }, [articleRef]);

  useEffect(() => {
    const article = articleRef.current;
    if (!article) return;

    collectHeadings();

    const observer = new MutationObserver(collectHeadings);
    observer.observe(article, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [articleRef, collectHeadings]);

  useEffect(() => {
    const article = articleRef.current;
    if (!article || headings.length === 0) return;

    let frameId: number | null = null;

    const updateProgress = () => {
      frameId = null;

      const rect = article.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset;
      const articleTop = rect.top + scrollY;
      const articleBottom = articleTop + article.offsetHeight;
      const start = articleTop - SCROLL_OFFSET;
      const end = Math.max(
        articleBottom - window.innerHeight + SCROLL_OFFSET,
        start + 1,
      );

      setProgress(clamp(((scrollY - start) / (end - start)) * 100, 0, 100));

      const headingElements = Array.from(
        article.querySelectorAll<HTMLHeadingElement>(HEADING_SELECTOR),
      );
      const nextActiveHeading = headingElements.reduce<HTMLHeadingElement | null>(
        (activeHeading, heading) => {
          if (heading.getBoundingClientRect().top <= SCROLL_OFFSET + 8) {
            return heading;
          }

          return activeHeading;
        },
        headingElements[0] ?? null,
      );

      if (nextActiveHeading?.id) {
        setActiveId(nextActiveHeading.id);
      }
    };

    const requestUpdate = () => {
      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(updateProgress);
    };

    requestUpdate();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, [articleRef, headings]);

  const navigateToHeading = (id: string) => {
    const article = articleRef.current;
    if (!article) return;

    const target = findHeadingById(article, id);
    if (!target) return;

    setActiveId(id);
    setIsExpanded(false);
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (headings.length === 0) return null;

  const roundedProgress = Math.round(progress);

  return (
    <div className={cn("min-w-0", className)}>
      <div className="sticky top-20 z-30 lg:hidden">
        <div className="overflow-hidden rounded-md border bg-background/95 shadow-sm backdrop-blur">
          <button
            type="button"
            className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
            aria-expanded={isExpanded}
            aria-controls={contentId}
            onClick={() => setIsExpanded((current) => !current)}
          >
            <span className="flex min-w-0 items-center gap-2 text-sm font-semibold">
              <ListTree className="size-4 shrink-0" aria-hidden="true" />
              <span className="truncate">Contents</span>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                {roundedProgress}%
              </span>
            </span>
            <ChevronDown
              className={cn(
                "size-4 shrink-0 text-muted-foreground transition-transform",
                isExpanded && "rotate-180",
              )}
              aria-hidden="true"
            />
          </button>
          <div className="h-1 bg-muted">
            <div
              className="h-full bg-primary transition-[width] duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div
            id={contentId}
            className={cn(
              "grid transition-[grid-template-rows] duration-300 ease-out",
              isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
            )}
          >
            <nav
              aria-label="Table of contents"
              className="min-h-0 overflow-hidden"
            >
              <div className="max-h-72 overflow-y-auto px-3 pb-3 pt-2">
                <TocItems
                  activeId={activeId}
                  headings={headings}
                  onNavigate={navigateToHeading}
                />
              </div>
            </nav>
          </div>
        </div>
      </div>

      <aside className="hidden lg:block">
        <div className="sticky top-24 overflow-hidden rounded-md border bg-background/85 p-4 shadow-sm backdrop-blur">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <ListTree className="size-4 shrink-0 text-muted-foreground" />
              <h2 className="truncate text-sm font-semibold">Contents</h2>
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              {roundedProgress}%
            </span>
          </div>
          <nav
            aria-label="Table of contents"
            className="relative max-h-[calc(100vh-12rem)] overflow-y-auto pl-4"
          >
            <div className="absolute bottom-1 left-1 top-1 w-px bg-border" />
            <div
              className="absolute left-1 top-1 w-px bg-primary transition-[height] duration-200"
              style={{ height: `${progress}%` }}
            />
            <TocItems
              activeId={activeId}
              headings={headings}
              onNavigate={navigateToHeading}
            />
          </nav>
        </div>
      </aside>
    </div>
  );
}
