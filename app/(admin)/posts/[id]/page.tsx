/** @format */

import { getCategories } from "@/actions/category";
import { getUniquePost } from "@/actions/post";
import PostForm from "@/components/post-form";
import prisma from "@/lib/prisma";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = id === "new" ? null : await getUniquePost(id);
  const [categories, types, seriesOptions, availableRelatedPosts] =
    await Promise.all([
      getCategories(),
      prisma.type.findMany({
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true },
      }),
      prisma.series.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true },
      }),
      prisma.post.findMany({
        where: id === "new" ? undefined : { NOT: { id } },
        orderBy: { updatedAt: "desc" },
        select: { id: true, title: true },
      }),
    ]);

  return (
    <>
      <div className="flex flex-col p-8">
        <div className="flex w-full justify-between">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/posts">posts</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {id === "new" || !post ? "New" : post.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="p-8 flex flex-col">
        {post ? (
          <PostForm
            id={post.id}
            title={post.title}
            content={post.content}
            imageUrl={post.imageUrl}
            categoryId={post.categoryId!}
            tags={post.tags.map((tag) => ({ label: tag, value: tag }))}
            status={post.status}
            categories={categories}
            types={types}
            seriesOptions={seriesOptions}
            availableRelatedPosts={availableRelatedPosts}
            slug={post.slug}
            description={post.description}
            readingTimeMins={post.readingTimeMins}
            featured={post.featured ?? false}
            repoUrl={post.repoUrl ?? ""}
            typeId={post.typeId ?? ""}
            seriesId={post.seriesId ?? ""}
            relatedPosts={post.relatedPosts ?? []}
          />
        ) : (
          <PostForm
            id=""
            title=""
            content=""
            imageUrl=""
            categoryId=""
            tags={[]}
            status="draft"
            categories={categories}
            types={types}
            seriesOptions={seriesOptions}
            availableRelatedPosts={availableRelatedPosts}
            slug=""
            description={""}
            readingTimeMins={1}
            featured={false}
            repoUrl=""
            typeId=""
            seriesId=""
            relatedPosts={[]}
          />
        )}
      </div>
    </>
  );
}
