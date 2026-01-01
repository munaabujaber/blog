/** @format */

"use server";

import { authSession } from "@/lib/auth-utils";
import prisma from "@/lib/prisma";
import { Post } from "@/prisma/generated/client";

export const getUniquePost = async (id: string) => {
  try {
    const session = await authSession();

    if (!session) {
      throw new Error("Unauthorized: User Id not found");
    }

    const res = (await prisma.post.findUnique({ where: { id } })) as Post;

    return res;
  } catch (err) {
    console.error({ err });
    throw new Error("Something went wrong");
  }
};
