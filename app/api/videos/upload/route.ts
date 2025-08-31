import { put } from "@vercel/blob"
import { createServerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const videoType = formData.get("videoType") as string
    const year = formData.get("year") as string
    const duration = formData.get("duration") as string
    const contactId = formData.get("contactId") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Upload to Vercel Blob
    const blob = await put(`videos/${Date.now()}-${file.name}`, file, {
      access: "public",
    })

    // Save to Supabase
    const supabase = createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase
      .from("videos")
      .insert({
        user_id: user.id,
        blob_url: blob.url,
        video_type: videoType,
        year: Number.parseInt(year),
        duration: Number.parseInt(duration),
        contact_id: contactId || null,
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to save video info" }, { status: 500 })
    }

    return NextResponse.json({
      id: data.id,
      url: blob.url,
      filename: file.name,
      size: file.size,
      type: file.type,
      videoType,
      year: Number.parseInt(year),
      duration: Number.parseInt(duration),
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
