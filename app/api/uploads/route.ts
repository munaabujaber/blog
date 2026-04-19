/** @format */

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

function extractFileKeyFromUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    const segments = parsed.pathname.split("/").filter(Boolean);
    const fileSegmentIndex = segments.findIndex((segment) => segment === "f");
    if (fileSegmentIndex >= 0 && segments[fileSegmentIndex + 1]) {
      return segments[fileSegmentIndex + 1];
    }
  } catch {
    return null;
  }

  return null;
}

export async function GET() {
  try {
    const uploads = await prisma.upload.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(uploads);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch uploads" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const upload = await prisma.upload.findFirst({
      where: { url },
    });

    if (upload) {
      await utapi.deleteFiles(upload.fileKey);
      await prisma.upload.delete({ where: { id: upload.id } });
      return NextResponse.json({ success: true });
    }

    // Fallback: if db record is missing, still try deleting directly in UploadThing.
    const fileKey = extractFileKeyFromUrl(url);
    if (fileKey) {
      await utapi.deleteFiles(fileKey);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete upload:", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 },
    );
  }
}
