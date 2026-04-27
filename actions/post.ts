/** @format */

"use server";

import prisma from "@/lib/prisma";
import { authSession } from "@/lib/auth-utils";
import { PostStatus } from "@/prisma/generated/client";
import type { PostFormValues } from "@/components/post-form";

export const getUniquePost = async (id: string) => {
  try {
    const session = await authSession();

    if (!session) {
      throw new Error("Unauthorized: User Id not found");
    }

    const res = await prisma.post.findUnique({
      where: { id },
      include: {
        relatedPosts: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return res;
  } catch (err) {
    console.error({ err });
    throw new Error("Something went wrong");
  }
};

export const getPostsByUser = async () => {
  try {
    const session = await authSession();

    if (!session) {
      throw new Error("Unauthorized: User Id not found");
    }

    const res = await prisma.post.findMany({
      take: 10,
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
    });

    return res;
  } catch (err) {
    console.error({ err });
    throw new Error("Something went wrong");
  }
};

export const removePost = async (id: string) => {
  try {
    const session = await authSession();

    if (!session) {
      throw new Error("Unauthorized: User Id not found");
    }

    const res = await prisma.post.delete({
      where: { id },
    });

    return res;
  } catch (err) {
    console.error({ err });
    throw new Error("Something went wrong");
  }
};

export const updatePost = async (params: PostFormValues) => {
  try {
    const session = await authSession();

    if (!session) {
      throw new Error("Unauthorized: User ID not found.");
    }

    const {
      tags,
      id,
      relatedPosts,
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
        relatedPosts: {
          set: relatedPosts?.map((post) => ({ id: post.id })) ?? [],
        },
      },
    });
    return res;
  } catch (err) {
    console.error({ err });
    throw new Error("Something went wrong");
  }
};

export const getAllPosts = async () => {
  try {
    const session = await authSession();

    if (!session) {
      throw new Error("Unauthorized: User Id not found");
    }

    const res = await prisma.post.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
      include: { category: true },
    });

    return res;
  } catch (err) {
    console.error({ err });
    throw new Error("Something went wrong");
  }
};

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
      tags,
      id: _id,
      relatedPosts,
      ...rest
    } = params;
    void _id;

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
