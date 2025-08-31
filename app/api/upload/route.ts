import { NextRequest } from "next/server";
import { handleUpload } from "@vercel/blob/client";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const response = await handleUpload({
    request: req,
    onBeforeGenerateToken: async () => ({
      allowedContentTypes: ["image/*", "video/*", "application/pdf"],
      maximumSizeInBytes: 50_000_000, // ~50MB
    }),
    onUploadCompleted: async ({ blob }) => {
      console.log("Archivo subido:", blob);
    },
  });

  return response;
}
