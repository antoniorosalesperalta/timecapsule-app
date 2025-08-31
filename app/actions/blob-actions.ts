"use server"

import { put, list, del } from "@vercel/blob"
import { createClient } from "@/lib/supabase/server"

export async function uploadVideoBlob(videoBlob: Blob, filename: string) {
  try {
    const { url } = await put(filename, videoBlob, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN!,
    })
    return { success: true, url }
  } catch (error) {
    console.error("Error uploading to blob storage:", error)
    return { success: false, error: "Failed to upload video" }
  }
}

export async function listVideoBlobs() {
  try {
    const { blobs } = await list({
      token: process.env.BLOB_READ_WRITE_TOKEN!,
    })

    const videoBlobs = blobs.filter((blob) => blob.pathname.includes("video-"))
    return { success: true, blobs: videoBlobs }
  } catch (error) {
    console.error("Error listing blob storage:", error)
    return { success: false, error: "Failed to list videos" }
  }
}

export async function deleteVideoBlob(url: string) {
  try {
    await del(url, {
      token: process.env.BLOB_READ_WRITE_TOKEN!,
    })
    return { success: true }
  } catch (error) {
    console.error("Error deleting from blob storage:", error)
    return { success: false, error: "Failed to delete video" }
  }
}

export async function saveVideoToDatabase(videoData: {
  user_id: string
  year: number
  video_type: "annual" | "personal"
  blob_url: string
  duration: number
  contact_id?: string
}) {
  try {
    const supabase = await createClient()

    const { error } = await supabase.from("videos").insert(videoData)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error("Error saving video to database:", error)
    return { success: false, error: "Failed to save video" }
  }
}
