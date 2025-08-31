import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Upload API called")

    const formData = await request.formData()
    console.log("[v0] FormData received")

    const file = formData.get("file") as File
    const videoType = formData.get("videoType") as string
    const year = formData.get("year") as string
    const duration = formData.get("duration") as string
    const contactId = formData.get("contactId") as string

    console.log("[v0] File details:", {
      name: file?.name,
      size: file?.size,
      type: file?.type,
      videoType,
      year,
      duration,
    })

    if (!file) {
      console.error("[v0] No file provided in FormData")
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (file.size === 0) {
      console.error("[v0] File is empty")
      return NextResponse.json({ error: "File is empty" }, { status: 400 })
    }

    if (!file.type.startsWith("video/") && !file.type.startsWith("audio/")) {
      console.error("[v0] Invalid file type:", file.type)
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 })
    }

    console.log("[v0] Starting Blob upload...")

    const blob = await put(`videos/${Date.now()}-${file.name}`, file, {
      access: "public",
    })

    console.log("[v0] Blob upload successful:", blob.url)

    return NextResponse.json({
      url: blob.url,
      filename: file.name,
      size: file.size,
      type: file.type,
      videoType: videoType || "annual",
      year: Number.parseInt(year) || new Date().getFullYear(),
      duration: Number.parseInt(duration) || 0,
    })
  } catch (error) {
    console.error("[v0] Upload error details:", error)
    return NextResponse.json(
      {
        error: "Upload failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
