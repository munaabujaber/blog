/** @format */

"use server";

import { PostFormValues } from "@/components/post-form";
import { authSession } from "@/lib/auth-utils";
import prisma from "@/lib/prisma";
import { PostStatus } from "@/prisma/generated/client";

export const updatePost = async (params: PostFormValues) => {
  try {
    const session = await authSession();

    if (!session) {
      throw new Error("Unauthorized: User ID not found.");
    }

    const {
      categories,
      types,
      tags,
      id,
      relatedPosts,
      series,
      ...rest
    } = params;

    const normalizedData = {
      ...rest,
      status: rest.status as PostStatus,
      userId: session.user.id,

      categoryId: rest.categoryId || null,
      typeId: rest.typeId || null,
      seriesId: rest.seriesId || null,
      repoUrl: rest.repoUrl || null,

      tags: tags?.map((tag) => tag.value) ?? [],
    };

    const res = await prisma.post.update({
      where: {
        id: id!, // id MUST exist when updating
      },
      data: {
        ...normalizedData,
        relatedPosts: relatedPosts?.length
          ? {
              set: [], // clear existing
              connect: relatedPosts.map((post) => ({ id: post.id })),
            }
          : undefined,
      },
    });
    return res;
  } catch (err) {
    throw new Error("Something went wrong");
  }
};
