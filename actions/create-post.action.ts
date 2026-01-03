/** @format */

"use server";

import { PostFormValues } from "@/components/post-form";
import { authSession } from "@/lib/auth-utils";
import prisma from "@/lib/prisma";
import { PostStatus } from "@/prisma/generated/client";

export const createPost = async (params: PostFormValues) => {
  try {
    const session = await authSession();

    if (!session) {
      throw new Error("Unauthorized: User ID not found.");
    }

    // if (session.user.role !== "ADMIN") {
    //   throw new Error("Forbidden.");
    // }

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

    const res = await prisma.post.create({
      data: {
        ...normalizedData,
        relatedPosts: relatedPosts?.length
          ? {
              connect: relatedPosts.map((post) => ({ id: post.id })),
            }
          : undefined,
      },
    });

    return res;
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong");
  }
};
