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

    const res = await prisma.post.create({
      data: {
        ...rest,
        status: rest.status as PostStatus,
        userId: session.user.id,
        tags: tags.map((tag) => tag.value),

        // Use the 'connect' syntax for relations
        relatedPosts: {
          connect: relatedPosts?.map((post) => ({
            id: post.id,
          })),
        },
      },
    });

    return res;
  } catch (err) {
    throw new Error("Something went wrong");
  }
};
