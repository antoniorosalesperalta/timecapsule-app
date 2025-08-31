import { del } from "@vercel/blob"
import { createServerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function DELETE(request: NextRequest) {
  try {
    const { videoId } = await request.json()

    if (!videoId) {
      return NextResponse.json({ error: "No video ID provided" }, { status: 400 })
    }

    const supabase = createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get video info from database
    const { data: video, error: fetchError } = await supabase
      .from("videos")
      .select("blob_url")
      .eq("id", videoId)
      .eq("user_id", user.id)
      .single()

    if (fetchError || !video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 })
    }

    // Delete from Vercel Blob
    await del(video.blob_url)

    // Delete from database
    const { error: deleteError } = await supabase.from("videos").delete().eq("id", videoId).eq("user_id", user.id)

    if (deleteError) {
      console.error("Database delete error:", deleteError)
      return NextResponse.json({ error: "Failed to delete video" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}
