/** @format */

"use server";

import { CategoryProps } from "@/hooks/use-categories";
import { authSession } from "@/lib/auth-utils";
import prisma from "@/lib/prisma";

export const updateCategory = async (category: CategoryProps) => {
  try {
    const session = await authSession();

    if (!session) {
      throw new Error("Unauthorized: User Id not found");
    }

    const res = await prisma.category.update({
      where: { id: category.id },
      data: { name: category.name },
    });

    return res;
  } catch (err) {
    console.error({ err });
    throw new Error("Something went wrong");
  }
};
