/** @format */

"use client";

import { OurFileRouter } from "@/app/api/uploadthing/core";
import { UploadDropzone, UploadButton } from "@/lib/uploadthing";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "sonner";

type MediaUploaderProps = {
  endpoint: keyof OurFileRouter;
  defaultUrl?: string | null;
  onChangeAction?: (url: string | null) => void;
  maxFiles?: number | null;
};

type Uploaded = {
  id: string;
  name: string;
  url: string;
  fileType: string;
};

export default function MediaUploader({
  endpoint,
  defaultUrl = null,
  onChangeAction,
}: MediaUploaderProps) {
  const cfg = {
    mode: "auto",
    appendOnPaste: true,
    cn: (v: string) => v,
  } as const;

  const [preview, setPreview] = useState<string | null>(defaultUrl);
  const [progress, setProgress] = useState<number>(0);
  const [uploads, setUploads] = useState<Uploaded[]>([]);

  // helper to convert UploadThing response into my Uploaded shape
  function mapResToUploaded(res: any[]): Uploaded[] {
    return res.map((f) => ({
      id: f.fileKey ?? f.id ?? String(Math.random()),
      name: f.fileName ?? f.name ?? "file",
      url: f.ufsUrl ?? f.url ?? f.fileUrl,
      fileType: f.mimeType ?? f.fileType ?? "",
    }));
  }

  return (
    <div className="flex flex-col gap-3">
      <UploadDropzone
        endpoint={endpoint}
        config={cfg}
        appearance={{
          container: "w-full rounded-md border-dashed border-2 p-6 text-center",
          allowedContent: "text-sm text-muted",
          button: "rounded px-3 py-1 bg-slate-700 text-white",
        }}
        content={{
          label() {
            return (
              <div className="text-sm">
                Drop images or videos here (or click)
              </div>
            );
          },
          button() {
            return <div className="text-sm">Choose files</div>;
          },
        }}
        // get preview immediately before upload starts
        onBeforeUploadBegin={(fileOrFiles: File | File[]) => {
          const files = Array.isArray(fileOrFiles)
            ? fileOrFiles
            : [fileOrFiles];
          // show preview for the first file
          try {
            setPreview(URL.createObjectURL(files[0]));
          } catch {
            setPreview(null);
          }
          // return unmodified files so upload continues
          return files;
        }}
        onUploadProgress={(p: number) => {
          // p in [0,1]
          setProgress(Math.round(p * 100));
        }}
        onClientUploadComplete={(res) => {
          const newUploads = mapResToUploaded(res);
          setUploads((s) => [...newUploads, ...s]);
          setProgress(100);
          setPreview(null);
          onChangeAction?.(newUploads[0]?.url ?? null);
          toast.success("Upload completed");
          // reset progress a short while later (optional)
          setTimeout(() => setProgress(0), 800);
        }}
        onUploadError={(err: Error) => {
          toast.error(`Upload error: ${err.message}`);
          setProgress(0);
        }}
      />

      {/* Optional UploadButton to let user open picker manually */}
      <div className="mt-2">
        <UploadButton endpoint={endpoint} config={cfg} />
      </div>

      {/* Preview UI */}
      {preview && (
        <div className="mt-3">
          {/* use <img> for blob urls (safer for previews) */}
          {/* When it's an image, show img; otherwise show <video> */}
          {preview.startsWith("data:") || preview.startsWith("blob:") ? (
            // try to infer type from URL or show as image
            <img
              src={preview}
              alt="preview"
              className="max-h-48 mx-auto rounded"
            />
          ) : preview.endsWith(".mp4") || preview.includes("video") ? (
            <video
              src={preview}
              controls
              className="max-h-48 mx-auto rounded"
            />
          ) : (
            <img
              src={preview}
              alt="preview"
              className="max-h-48 mx-auto rounded"
            />
          )}
        </div>
      )}

      {/* Progress */}
      {progress > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div
            className="bg-blue-600 h-2 rounded"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Uploaded list */}
      {uploads.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          {uploads.map((u) => (
            <div key={u.id} className="bg-white rounded p-2">
              {u.fileType.startsWith("image/") ? (
                <img
                  src={u.url}
                  alt={u.name}
                  className="w-full h-28 object-cover rounded"
                />
              ) : (
                <video
                  src={u.url}
                  className="w-full h-28 object-cover rounded"
                />
              )}
              <p className="text-xs mt-1 truncate">{u.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
