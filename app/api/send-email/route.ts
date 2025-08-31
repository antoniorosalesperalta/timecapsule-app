import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { to, subject, videoUrl, qrCodeUrl } = await request.json()

    // Here you would integrate with an email service like Resend, SendGrid, etc.
    // For now, we'll just log the email details
    console.log("Sending email:", {
      to,
      subject,
      videoUrl,
      qrCodeUrl,
    })

    // In a real implementation, you would:
    // 1. Generate QR code that links to the video
    // 2. Send email with video attachment or link
    // 3. Include QR code for tombstone use

    return NextResponse.json({ success: true, message: "Email sent successfully" })
  } catch (error) {
    console.error("Error sending email:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
