import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createClient()

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0]

    // Find users whose reminder date is today
    const { data: users, error } = await supabase
      .from("profiles")
      .select("id, email, annual_reminder_date")
      .eq("annual_reminder_date", today)

    if (error) {
      console.error("Error fetching users:", error)
      return NextResponse.json({ error: "Database error" }, { status: 500 })
    }

    if (!users || users.length === 0) {
      return NextResponse.json({ message: "No reminders for today" })
    }

    // Send reminder emails
    const emailPromises = users.map(async (user) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SITE_URL || "https://timecapsuleapp.vercel.app"}/api/send-email`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              to: user.email,
              subject: "🎥 Es hora de grabar tu video anual - TimeCapsule",
              html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #ec4899;">¡Es hora de grabar tu video anual!</h2>
                <p>Hola,</p>
                <p>Es el momento de grabar tu video anual para TimeCapsule. Este video será parte de tu legado digital para tus seres queridos.</p>
                <p><strong>Recuerda:</strong></p>
                <ul>
                  <li>El video debe durar máximo 1 minuto</li>
                  <li>Habla desde el corazón</li>
                  <li>Comparte cómo te sientes en este momento de tu vida</li>
                </ul>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="https://timecapsuleapp.vercel.app" style="background-color: #ec4899; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
                    Grabar Video Ahora
                  </a>
                </div>
                <p style="color: #666; font-size: 14px;">
                  Si no grabas hoy, tienes hasta 14 días para completar tu video anual.
                </p>
                <p style="color: #666; font-size: 12px;">
                  Este email fue enviado por TimeCapsule - Tu legado digital para las futuras generaciones.
                </p>
              </div>
            `,
            }),
          },
        )

        if (!response.ok) {
          throw new Error(`Failed to send email to ${user.email}`)
        }

        return { success: true, email: user.email }
      } catch (error) {
        console.error(`Error sending email to ${user.email}:`, error)
        return { success: false, email: user.email, error: error.message }
      }
    })

    const results = await Promise.all(emailPromises)
    const successful = results.filter((r) => r.success).length
    const failed = results.filter((r) => !r.success).length

    return NextResponse.json({
      message: `Processed ${users.length} reminders`,
      successful,
      failed,
      results,
    })
  } catch (error) {
    console.error("Error in check-reminders:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Also allow POST for manual testing
export async function POST() {
  return GET()
}
