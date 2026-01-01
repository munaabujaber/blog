/** @format */

"use server";

import { authSession } from "@/lib/auth-utils";
import prisma from "@/lib/prisma";

export const getCategories = async () => {
  try {
    const session = await authSession();

    if (!session) {
      throw new Error("Unauthorized: User Id not found");
    }

    const res = await prisma.category.findMany({
      orderBy: { createdAt: "desc" },
    });

    return res;
  } catch (err) {
    console.error({ err });
    throw new Error("Something went wrong");
  }
};
