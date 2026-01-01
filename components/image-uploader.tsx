/** @format */

"use client";

import { OurFileRouter } from "@/app/api/uploadthing/core";
import { UploadDropzone, UploadButton } from "@/lib/uploadthing";
import {
  isImageLike,
  validateImageBeforeUpload,
} from "@/lib/uploadthing-utils";
import { X } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";

type ImageUploaderProps = {
  /** Controlled value. If provided, component becomes controlled and parent must update this prop when onChangeAction is called. */
  value?: string | null;
  // Backwards-compatible: initial uncontrolled value
  defaultUrl?: string | null;
  onChangeAction?: (url: string | null) => void;
  endpoint: keyof OurFileRouter;
  dropzoneContent?: { label?: string; allowedContent?: string };
  dropzoneAppearance?: any;
  // Optional overrides forwarded to UploadButton
  buttonAppearance?: any;
  buttonContent?: any;
  onClientUploadCompleteAction?: (res: any) => void;
};

export default function ImageUploader({
  value,
  defaultUrl,
  onChangeAction,
  endpoint,
  dropzoneContent,
  dropzoneAppearance,
  buttonAppearance,
  buttonContent,
  onClientUploadCompleteAction,
}: ImageUploaderProps) {
  const isControlled = value !== undefined;

  // internal state used when uncontrolled
  const [internalValue, setInternalValue] = useState<string | null>(
    defaultUrl ?? null
  );
  const displayedValue = isControlled ? value ?? null : internalValue;
  const [showDropzone, setShowDropzone] = useState<boolean>(!displayedValue);

  // Keep show/displayed state in sync when controlled value changes
  useEffect(() => {
    if (isControlled) {
      setShowDropzone(!(value ?? null));
    }
  }, [isControlled, value]);

  const handleSet = (url: string | null) => {
    // notify parent
    onChangeAction?.(url);

    // update internal state only when uncontrolled
    if (!isControlled) {
      setInternalValue(url);
      setShowDropzone(!url);
    }
  };

  // Holds files selected in manual mode; only images allowed here
  const [selectedFiles, setSelectedFiles] = useState<File[] | null>(null);

  if (!showDropzone && displayedValue) {
    // Some upload URLs (ufs.sh) don't contain .svg extension but can still be SVGs.
    // Treat any resource served from ufs.sh as unoptimized so SVGs render.
    let isSvg = false;
    try {
      const parsed = new URL(displayedValue);
      isSvg =
        /\.svg($|\?)/i.test(parsed.pathname) ||
        parsed.hostname.endsWith(".ufs.sh");
    } catch {
      isSvg = /\.svg($|\?)/i.test(displayedValue);
    }

    return (
      <div className="relative">
        <div className="relative w-full min-w-150 min-h-50 shadow-lg overflow-hidden rounded-xl">
          <Image
            src={displayedValue}
            className="object-cover"
            fill
            alt="thumbnail"
            // allow SVGs to render without next/image optimization
            unoptimized={isSvg}
          />
        </div>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            className="absolute rounded-full right-0 top-0 bg-white opacity-60
            hover:opacity-100 shadow-2xl p-2 m-2 cursor-pointer"
            onClick={() => {
              handleSet(null);
              setShowDropzone(true);
            }}
          >
            <X />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <UploadDropzone
        endpoint={endpoint}
        config={{ mode: "auto" }}
        // validate files before upload starts and prevent non-image uploads
        onBeforeUploadBegin={(fileOrFiles) => {
          console.log("onBeforeUploadBegin files:", fileOrFiles);
          try {
            const validated = validateImageBeforeUpload(
              fileOrFiles as File | File[]
            );
            // normalize to File[] per UploadDropzone expectation
            return Array.isArray(validated) ? validated : [validated];
          } catch (err) {
            toast.error(
              (err as Error).message ?? "Only image files are allowed."
            );
            throw err;
          }
        }}
        // helpful for debugging or tracking selected files
        // onChange={(files) => {
        //   console.log("Dropzone selected files:", files);
        //   const images = files.filter((f) => isImageLike(f));
        //   setSelectedFiles(images.length ? images : null);
        // }}
        content={
          dropzoneContent ?? {
            label: displayedValue
              ? "Drop or click to replace the image"
              : "Drop or click to upload an image",
            allowedContent: "PNG, JPG, JPEG . up to 4MB",
          }
        }
        appearance={
          dropzoneAppearance ?? {
            button: "rounded-lg",
            container: "rounded-xl border",
          }
        }
        onUploadBegin={() => {
          toast.info("Uploading image...");
          console.log("upload begin");
        }}
        onUploadError={(err) => {
          console.error("upload error", err);
          toast.error(`Uploading image failed: ${err?.message ?? err}`);
        }}
        onClientUploadComplete={(res) => {
          const url = res?.[0]?.ufsUrl;

          if (url) {
            handleSet(url);
            setShowDropzone(false);
          }

          // forward to caller if they provided a handler
          onClientUploadCompleteAction?.(res);
          // clear selected files after upload
          setSelectedFiles(null);
        }}
      />

      {/* <UploadButton
        endpoint={endpoint}
        config={{ mode: "auto" }}
        appearance={
          buttonAppearance ?? {
            button:
              "rounded-md bg-amber-600 text-white px-4 py-2 hover:bg-amber-700",
            container: "flex items-center gap-2",
          }
        }
        content={
          buttonContent ?? {
            button: "Pick or Upload Image",
            allowedContent: "PNG, JPG, JPEG up to 4MB",
          }
        }
        onBeforeUploadBegin={(fileOrFiles) => {
          try {
            const validated = validateImageBeforeUpload(
              fileOrFiles as File | File[]
            );
            return Array.isArray(validated) ? validated : [validated];
          } catch (err) {
            toast.error(
              "Only image files are allowed: PNG, JPG, JPEG or SVG. Please check file type and retry."
            );
            throw err;
          }
        }}
        onClientUploadComplete={(res) => {
          const url = res?.[0]?.ufsUrl;
          if (url) {
            handleSet(url);
            setShowDropzone(false);
          }

          onClientUploadCompleteAction?.(res);
        }}
        onUploadError={(error: Error) => {
          toast.error(error.message);
        }}
      /> */}
    </div>
  );
}
