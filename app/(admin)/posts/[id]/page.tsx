/** @format */

import { getCategories } from "@/actions/get-categories.action";
import { getUniquePost } from "@/actions/get-unique-post.action";
import PostForm from "@/components/post-form";
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
  const categories = await getCategories();

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
            slug={post.slug}
            description={post.description}
            readingTimeMins={post.readingTimeMins}
          />
        ) : (
          <PostForm
            id=""
            title=""
            content=""
            imageUrl=""
            categoryId=""
            tags={[]}
            status=""
            categories={categories}
            slug=""
            description={""}
            readingTimeMins={0}
          />
        )}
      </div>
    </>
  );
}
