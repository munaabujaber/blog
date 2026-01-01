/** @format */

// Utilities for validating files before uploading with UploadThing
import DOMPurify from "dompurify";

export const ALLOWED_IMAGE_EXTENSIONS = [
  "png",
  "jpg",
  "jpeg",
  "gif",
  "webp",
  "svg",
];
export type MaybeFileLike = { name?: string; type?: string } | File;
export type AllowedTypes = "image" | "pdf" | "blob" | string[];

/**
 * Magic Byte Validation
 * Check the first few bytes of a file to verify it is actually an image.
 */
export async function isImage(file: File | Blob): Promise<boolean> {
  // Read the first 512 bytes
  // (enough to catch SVG tags even after XML declarations)
  const headerBuffer = await file.slice(0, 512).arrayBuffer();
  const arr = new Uint8Array(headerBuffer);

  // Helper to get hex string for binary checks
  const getHex = (len: number) =>
    Array.from(arr.slice(0, len))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase();

  // Binary Formats
  const hex4 = getHex(4);
  const hex3 = getHex(3);

  if (hex3 === "FFD8FF") return true; // JPEG/JPG
  if (hex4 === "89504E47") return true; // PNG
  if (hex4 === "47494638") return true; // GIF

  // WebP: Starts with 'RIFF' and has 'WEBP' at offset 8
  if (hex4 === "52494646") {
    const webpCheck = Array.from(arr.slice(8, 12))
      .map((b) => String.fromCharCode(b))
      .join("");
    if (webpCheck === "WEBP") return true;
  }

  // SVG (Text-based)
  // Convert buffer to string to look for <svg tag
  const textPreview = new TextDecoder().decode(arr).trim().toLowerCase();
  if (textPreview.includes("<svg") || textPreview.startsWith("<?xml")) {
    // Basic check to ensure it actually contains an <svg tag
    return textPreview.includes("<svg");
  }

  return false;
}

/**
 * Return true when the provided File-like value represents an image.
 * It checks the `type` first (preferred) and falls back to file extension.
 */
export function isImageLike(file: MaybeFileLike) {
  const f = file as File | undefined;

  if (f?.type) return f.type.startsWith("image/");

  const name = (f as any)?.name ?? (file as any)?.name;
  if (!name) return false;

  const match = name.match(/\.([a-z0-9]+)(?:\?.*)?$/i);
  const ext = match?.[1]?.toLowerCase();
  return !!ext && ALLOWED_IMAGE_EXTENSIONS.includes(ext);
}

/**
 * Validation helper intended to be used as `onBeforeUploadBegin`.
 * Throws an Error if any provided file is not image-like.
 */
export function validateImageBeforeUpload<T extends File | File[]>(
  fileOrFiles: T
) {
  const files = Array.isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles];
  for (const f of files) {
    if (!isImageLike(f)) throw new Error("Only image files are allowed");
  }
  return fileOrFiles;
}

export function isPdfLike(file: MaybeFileLike) {
  const f = file as File | undefined;
  if (f?.type) return f.type === "application/pdf";
  const name = (f as any)?.name ?? (file as any)?.name;
  if (!name) return false;
  const match = name.match(/\.([a-z0-9]+)(?:\?.*)?$/i);
  const ext = match?.[1]?.toLowerCase();
  return ext === "pdf";
}

export function isAllowedType(file: MaybeFileLike, allowedTypes: AllowedTypes) {
  if (allowedTypes === "image") return isImageLike(file);
  if (allowedTypes === "pdf") return isPdfLike(file);
  if (allowedTypes === "blob") return true;
  if (Array.isArray(allowedTypes)) {
    for (const t of allowedTypes) {
      if (t.includes("/")) {
        // treat as mime type
        if ((file as File)?.type?.startsWith(t)) return true;
      } else {
        // treat as extension
        const name = (file as any)?.name;
        if (name?.toLowerCase().endsWith(`.${t.toLowerCase()}`)) return true;
      }
    }
    return false;
  }
  return false;
}
