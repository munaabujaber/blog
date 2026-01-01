/** @format */

"use client";

import { OurFileRouter } from "@/app/api/uploadthing/core";
import { UploadDropzone, UploadButton } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";
import { isImageLike } from "@/lib/uploadthing-utils";

import { X, UploadCloud } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";

type ImageUploaderProps = {
  endpoint: keyof OurFileRouter;
  defaultUrl?: string | null;
  onChangeAction?: (url: string | null) => void;
  // Optional container size classes – use Tailwind width/height classes like 'w-48'/'h-32'
  size?: { width?: string; height?: string };
};

export default function FileUploader({
  endpoint,
  defaultUrl,
  onChangeAction,
  size,
}: ImageUploaderProps) {
  const cfg = { mode: "manual", appendOnPaste: true, cn } as const;

  const widthClass = size?.width ?? "w-48";
  const heightClass = size?.height ?? "h-32";

  const [value, setValue] = useState<string | null>(defaultUrl ?? null);
  const [showDropzone, setShowDropzone] = useState<boolean>(!defaultUrl);
  // staged selection (manual mode)
  const [selectedFiles, setSelectedFiles] = useState<File[] | null>(null);
  const [stagedPreview, setStagedPreview] = useState<string | null>(null);
  const stagedRef = React.useRef<string | null>(null);

  // Keep component in sync when defaultUrl prop changes
  useEffect(() => {
    setValue(defaultUrl ?? null);
    setShowDropzone(!(defaultUrl ?? null));
  }, [defaultUrl]);

  // Revoke old object URL when staged preview changes/unmount
  useEffect(() => {
    return () => {
      if (stagedRef.current) {
        URL.revokeObjectURL(stagedRef.current);
        stagedRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    // revoke previous
    if (stagedRef.current) {
      URL.revokeObjectURL(stagedRef.current);
      stagedRef.current = null;
    }
    if (selectedFiles && selectedFiles.length > 0) {
      const f = selectedFiles[0];
      try {
        const url = URL.createObjectURL(f);
        stagedRef.current = url;
        setStagedPreview(url);
      } catch {
        setStagedPreview(null);
      }
    } else {
      setStagedPreview(null);
    }
  }, [selectedFiles]);

  const handleSet = (url: string | null) => {
    setValue(url);
    onChangeAction?.(url);
  };

  // If we already have an uploaded image (value), show a static preview block
  // with fixed dimensions and a remove button. Otherwise show the dropzone UI.
  if (value) {
    // Treat any resource served from ufs.sh as unoptimized so SVGs render
    let isSvg = false;
    try {
      const parsed = new URL(value);
      isSvg =
        /\.svg($|\?)/i.test(parsed.pathname) ||
        parsed.hostname.endsWith(".ufs.sh");
    } catch {
      isSvg = /\.svg($|\?)/i.test(value);
    }

    return (
      <div
        className={`relative ${widthClass} ${heightClass} rounded-md bg-slate-200 overflow-hidden`}
      >
        <img
          src={value}
          alt="uploaded"
          className="w-full h-full object-contain"
        />
        <button
          type="button"
          aria-label="Remove image"
          onClick={() => {
            // await utapi.deleteFiles(URL);
            handleSet(null);
            setSelectedFiles(null);
            if (stagedRef.current) {
              URL.revokeObjectURL(stagedRef.current);
              stagedRef.current = null;
            }
            setStagedPreview(null);
          }}
          className="absolute right-2 top-2 z-10 bg-white rounded-full p-1 shadow"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // No value: render the dropzone (manual mode)
  return (
    <div className="flex flex-col">
      <UploadDropzone
        endpoint={endpoint}
        config={cfg}
        appearance={{
          // Fixed dimensions + gray background and relative positioning for overlays
          container: `${widthClass} ${heightClass} rounded-md bg-slate-200 relative overflow-hidden`,
          uploadIcon: "",
          label: "",
          allowedContent:
            "flex h-8 flex-col items-center justify-center px-2 text-white",
          button:
            "ut-ready:bg-green-400 ut-uploading:cursor-not-allowed rounded-r-none bg-red-500 bg-none after:bg-orange-400",
        }}
        content={{
          uploadIcon({ ready, isUploading }) {
            // If there's an uploaded value show it inside the dropzone as the main visual
            // no value here (we returned above)

            // If user staged an image (manual mode) show a mini square preview
            if (stagedPreview && isImageLike(selectedFiles?.[0] ?? {})) {
              return (
                <img
                  src={stagedPreview}
                  alt="staged preview"
                  className="w-8 h-8 object-cover rounded-sm"
                />
              );
            }

            return (
              <UploadCloud
                className={
                  isUploading
                    ? "animate-spin w-5 h-5 text-white"
                    : "w-5 h-5 text-white"
                }
              />
            );
          },
          label({ ready, isUploading }) {
            if (selectedFiles && selectedFiles.length > 0) {
              return `Ready to upload: ${selectedFiles[0].name}`;
            }
            return value
              ? "Drop or click to replace the image"
              : "Drop or click to upload an image";
          },
          allowedContent({}) {
            if (selectedFiles && selectedFiles.length > 0) {
              return `Selected: ${selectedFiles[0].name}`;
            }
            return "Allowed formats: PNG, SVG, JPG, JPEG. File size limit: 4MB";
          },
          button({ ready, isUploading }) {
            if (!ready) return "Getting ready...";
            return (
              <div className="flex items-center gap-2 px-3">
                <UploadCloud
                  className={
                    isUploading
                      ? "animate-spin w-5 h-5 text-white"
                      : "w-5 h-5 text-white"
                  }
                />
                <span>
                  {isUploading
                    ? "Uploading…"
                    : selectedFiles && selectedFiles.length > 0
                    ? "Upload selected"
                    : "Upload files"}
                </span>
              </div>
            );
          },
        }}
        // track staged files when in manual mode
        onChange={(files) => {
          const arr = Array.isArray(files) ? files : [files];
          setSelectedFiles(arr.length ? arr : null);
        }}
        onBeforeUploadBegin={(fileOrFiles: File | File[]) => {
          const files = Array.isArray(fileOrFiles)
            ? fileOrFiles
            : [fileOrFiles];
          return files;
        }}
        onUploadProgress={(p: number) => {
          // p is a number between 0 and 1 indicating upload progress
          console.log("Upload progress:", p);
        }}
        uploadProgressGranularity="fine"
        onUploadBegin={(name) => {
          // Do something once upload begins
          console.log("Uploading: ", name);
        }}
        onClientUploadComplete={(res) => {
          const url = res?.[0]?.ufsUrl;
          if (url) {
            handleSet(url);
            setShowDropzone(false);
          }
          // clear staged preview/files after successful upload
          setSelectedFiles(null);
          if (stagedRef.current) {
            URL.revokeObjectURL(stagedRef.current);
            stagedRef.current = null;
          }
          setStagedPreview(null);
          alert({ res });
        }}
        onUploadError={(error: Error) => {
          toast.error("Uploading image failed");
        }}
        onUploadAborted={() => {
          //
        }}
      />
    </div>
  );
}
