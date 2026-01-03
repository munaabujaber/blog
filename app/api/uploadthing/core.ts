import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import prisma from "@/lib/prisma";

const f = createUploadthing();

const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  // Profile / avatar uploads (single image up to 4MB)
  imageUploader: f({
    image: {
      maxFileSize: "4MB", maxFileCount: 1, additionalProperties: {
      
    } },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const user = await auth(req);

      // If you throw, the user will not be able to upload
      if (!user) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
    await prisma.upload.create({
      data: {
        name: file.name,
        url: file.ufsUrl,
        fileKey: file.key,
        fileType: file.type,
        fileSize: file.size
      },
    });

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),

  // Media uploads for posts: multiple images (small) and a single large video
  mediaPost: f({
    image: { maxFileSize: "4MB", maxFileCount: 4 },
    // 128MB is a safe supported preset for larger videos
    video: { maxFileSize: "128MB", maxFileCount: 1 },
  })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("mediaPost upload complete for userId:", metadata.userId);
      console.log("file url", file.ufsUrl);

      const uploaded: any = file as any;

      try {
        await prisma.upload.create({
          data: {
            name: (uploaded.name ?? uploaded.filename ?? uploaded.id ?? "") as string,
            url: uploaded.ufsUrl,
            fileKey: (uploaded.fileKey ?? uploaded.id ?? "") as string,
            fileType: (uploaded.mime ?? uploaded.fileType ?? "") as string,
            fileSize: (uploaded.size ?? 0) as number,
          },
        });
      } catch (err) {
        console.error("Failed to persist upload", err);
      }

      return { uploadedBy: metadata.userId };
    }),

  // Document uploads (pdfs and plain text)
  documentUploader: f({
    // 8MB preset for PDFs
    pdf: { maxFileSize: "8MB", maxFileCount: 1 },
    text: { maxFileSize: "64KB", maxFileCount: 1 },
  })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("documentUploader upload complete for userId:", metadata.userId);
      console.log("file url", file.ufsUrl);

      const uploaded: any = file as any;

      try {
        await prisma.upload.create({
          data: {
            name: (uploaded.name ?? uploaded.filename ?? uploaded.id ?? "") as string,
            url: uploaded.ufsUrl,
            fileKey: (uploaded.fileKey ?? uploaded.id ?? "") as string,
            fileType: (uploaded.mime ?? uploaded.fileType ?? "") as string,
            fileSize: (uploaded.size ?? 0) as number,
          },
        });
      } catch (err) {
        console.error("Failed to persist upload", err);
      }

      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
