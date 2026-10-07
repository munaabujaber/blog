/** @format */

"use server";

import { revalidatePath } from "next/cache";

import {
  ABOUT_PAGE_CONTENT_ID,
  defaultAboutPageContent,
  type AboutPageContentValues,
} from "@/lib/about-content";
import { requireAuth } from "@/lib/auth-utils";
import prisma from "@/lib/prisma";

export async function getAboutPageContent(): Promise<AboutPageContentValues> {
  try {
    const content = await prisma.aboutPageContent.findUnique({
      where: { id: ABOUT_PAGE_CONTENT_ID },
    });

    if (!content) {
      return defaultAboutPageContent;
    }

    return {
      generalText: content.generalText,
      mainPhotoUrl: content.mainPhotoUrl,
    };
  } catch (error) {
    console.error({ error });
    return defaultAboutPageContent;
  }
}

export async function updateAboutPageContent(
  values: AboutPageContentValues,
): Promise<AboutPageContentValues> {
  await requireAuth();

  const content = await prisma.aboutPageContent.upsert({
    where: { id: ABOUT_PAGE_CONTENT_ID },
    create: {
      id: ABOUT_PAGE_CONTENT_ID,
      generalText: values.generalText,
      mainPhotoUrl: values.mainPhotoUrl,
    },
    update: {
      generalText: values.generalText,
      mainPhotoUrl: values.mainPhotoUrl,
    },
  });

  revalidatePath("/about");
  revalidatePath("/dashboard/about");

  return {
    generalText: content.generalText,
    mainPhotoUrl: content.mainPhotoUrl,
  };
}
