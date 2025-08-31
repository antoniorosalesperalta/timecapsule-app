import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST() {
  try {
    const today = new Date().toISOString().split("T")[0]

    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("id, email, annual_reminder_date")
      .eq("annual_reminder_date", today)

    if (error) throw error

    const emailsSent = []

    for (const profile of profiles || []) {
      const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: profile.email,
          subject: "🎥 ¡Es hora de grabar tu video anual de TimeCapsule!",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #e11d48;">¡Es tu día especial en TimeCapsule! 🎥</h2>
              <p>Hola,</p>
              <p>Es momento de grabar tu video anual para TimeCapsule. Este es un momento especial para compartir tus pensamientos, experiencias y crecimiento del último año.</p>
              
              <div style="background: #fdf2f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #be185d; margin-top: 0;">Recordatorios importantes:</h3>
                <ul style="color: #9f1239;">
                  <li>Tienes hasta 2 semanas para grabar tu video</li>
                  <li>El video debe durar máximo 1 minuto</li>
                  <li>Solo puedes grabar un video por año</li>
                  <li>Piensa en algo significativo que quieras compartir con tus seres queridos</li>
                </ul>
              </div>
              
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}" 
                 style="display: inline-block; background: #e11d48; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Grabar mi Video Anual
              </a>
              
              <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
                Este es un recordatorio automático de TimeCapsule. Tu video será parte del legado que dejarás a tus seres queridos.
              </p>
            </div>
          `,
        }),
      })

      if (emailResponse.ok) {
        emailsSent.push(profile.email)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Recordatorios enviados a ${emailsSent.length} usuarios`,
      emails: emailsSent,
    })
  } catch (error) {
    console.error("Error checking reminders:", error)
    return NextResponse.json({ error: "Error checking reminders" }, { status: 500 })
  }
}
