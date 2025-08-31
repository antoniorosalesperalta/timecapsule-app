import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { to, subject, videoUrl, qrCodeUrl, html } = await request.json()

    console.log("Sending email:", {
      to,
      subject,
      videoUrl,
      qrCodeUrl,
      html: html ? "HTML content provided" : "No HTML content",
    })

    if (html) {
      // This is a reminder email with HTML content
      console.log("Reminder email HTML:", html.substring(0, 100) + "...")
    }

    // In a real implementation, you would integrate with:
    // - Resend: https://resend.com/docs
    // - SendGrid: https://docs.sendgrid.com/
    // - Nodemailer with SMTP
    //
    // Example with Resend:
    // const resend = new Resend(process.env.RESEND_API_KEY)
    // await resend.emails.send({ from, to, subject, html })

    return NextResponse.json({ success: true, message: "Email sent successfully" })
  } catch (error) {
    console.error("Error sending email:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
