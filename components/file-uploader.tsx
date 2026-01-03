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

type Upload = {
  id: string;
  name: string;
  url: string;
  fileType: string;
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

  const [uploads, setUploads] = useState<Upload[]>([]);

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

  const fetchUploads = async () => {
    const res = await fetch("/api/uploads");
    setUploads(await res.json());
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this file?")) return false;

    try {
      const res = await fetch(`/api/uploads/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        console.error("Delete failed", data);
        return false;
      }

      await fetchUploads();
      return true;
    } catch (err) {
      console.error("Delete request failed", err);
      return false;
    }
  };

  useEffect(() => {
    fetchUploads();
  }, []);

  const handleSet = (url: string | null) => {
    setValue(url);
    onChangeAction?.(url);
  };

  // Show preview only when we are explicitly hiding the dropzone and we have a value.
  // When the user removes the image we set `showDropzone` to true so the dropzone appears.
  if (!showDropzone && value) {
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
        // Avoid reading uploads[0].id when uploads may be empty
        key={uploads[0]?.id ?? "preview"}
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
          onClick={async () => {
            // Find matching upload by URL
            const upload = uploads.find((u) => u.url === value);

            // If found, attempt server delete; otherwise just clear local preview
            let deleted = false;
            if (upload) {
              deleted = await handleDelete(upload.id);
              if (!deleted) {
                toast.error("Failed to delete file from server.");
              }
            }

            // Clear the value and show the dropzone again regardless
            handleSet(null);
            setShowDropzone(true);
            setSelectedFiles(null);
            if (stagedRef.current) {
              URL.revokeObjectURL(stagedRef.current);
              stagedRef.current = null;
            }
            setStagedPreview(null);
            if (deleted) toast.success("File deleted");
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
          // UploadDropzone may call this during its own render lifecycle (e.g. on paste)
          // so defer setState to avoid React "setState during render of another component" errors.
          const arr = Array.isArray(files) ? files : [files];
          queueMicrotask(() => setSelectedFiles(arr.length ? arr : null));
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
            // Refresh server-side uploads so we can find DB id later
            fetchUploads().catch(() => {});
            toast.success("Upload completed");
          } else {
            toast.error("Upload failed. No URL returned.");
          }

          // clear selected files after upload
          setSelectedFiles(null);
          if (stagedRef.current) {
            URL.revokeObjectURL(stagedRef.current);
            stagedRef.current = null;
          }
          setStagedPreview(null);
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
