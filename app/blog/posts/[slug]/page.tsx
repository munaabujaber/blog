/** @format */

import { getBlogPostBySlug, updatePostViews } from "@/actions/blog";
import PostContent from "@/components/post-content";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await getBlogPostBySlug(slug);

  if (!post) return null;

  await updatePostViews(post.id);

  return <PostContent post={post} />;
}
