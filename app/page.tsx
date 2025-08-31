"use client"

import { Users, Video, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

const PadlockHeartIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C9.79 2 8 3.79 8 6v2H7c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2h-1V6c0-2.21-1.79-4-4-4zm0 2c1.1 0 2 .9 2 2v2h-4V6c0-1.1.9-2 2-2z" />
    <path d="M12 13c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1s1-.45 1-1v-3c0-.55-.45-1-1-1z" />
    <path d="M12 8.5c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5zm0 3.5c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
    <path d="M9.5 6.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5z" fill="white" />
  </svg>
)

export default function TimeCapsule() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  const [currentView, setCurrentView] = useState("dashboard")
  const [showIntro, setShowIntro] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isConfigured, setIsConfigured] = useState(false)
  const [reminderDate, setReminderDate] = useState("")
  const [familyContacts, setFamilyContacts] = useState([])
  const [trustedContact, setTrustedContact] = useState("")
  const [lastCheckIn, setLastCheckIn] = useState(new Date().toLocaleDateString("es-ES"))

  useEffect(() => {
    let timeoutId = null

    const checkAuth = async () => {
      try {
        // Set a timeout to prevent infinite loading
        timeoutId = setTimeout(() => {
          console.log("[v0] Auth check timeout, proceeding without auth")
          setLoading(false)
          setShowIntro(true)
        }, 5000)

        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        clearTimeout(timeoutId)

        if (error) {
          console.error("Auth error:", error)
          setLoading(false)
          router.push("/auth/login")
          return
        }

        if (!session) {
          setLoading(false)
          router.push("/auth/login")
          return
        }

        setUser(session.user)
        try {
          await loadBasicUserData(session.user.id)
        } catch (error) {
          console.error("Error loading user data:", error)
        }
        setLoading(false)
      } catch (error) {
        clearTimeout(timeoutId)
        console.error("Session check failed:", error)
        setLoading(false)
        router.push("/auth/login")
      }
    }

    checkAuth()

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [])

  const loadBasicUserData = async (userId) => {
    try {
      // Load only essential data
      const { data: profile } = await supabase
        .from("profiles")
        .select("annual_reminder_date, last_check_in")
        .eq("id", userId)
        .single()

      if (profile) {
        setReminderDate(profile.annual_reminder_date || "")
        setIsConfigured(!!profile.annual_reminder_date)
        if (profile.last_check_in) {
          setLastCheckIn(new Date(profile.last_check_in).toLocaleDateString("es-ES"))
        }
      }

      // Load contacts
      const { data: contacts } = await supabase.from("contacts").select("*").eq("user_id", userId)

      if (contacts) {
        setFamilyContacts(
          contacts.map((contact) => ({
            id: contact.id,
            name: contact.name,
            email: contact.email,
            relation: contact.relationship,
            rut: contact.rut || "",
          })),
        )
      }

      // Load trusted contact
      const { data: trustedContacts } = await supabase
        .from("trusted_contacts")
        .select("email")
        .eq("user_id", userId)
        .single()

      if (trustedContacts) {
        setTrustedContact(trustedContacts.email)
      }
    } catch (error) {
      console.error("Error loading basic user data:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <PadlockHeartIcon className="w-8 h-8 text-rose-600" />
          </div>
          <p className="text-muted-foreground">Cargando TimeCapsule...</p>
        </div>
      </div>
    )
  }

  const introSlides = [
    {
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-EHpdxWsvTwc6tv25ayfyZ2e2Ij5F9E.png",
      title: "Conexiones que Perduran",
      description: "TimeCapsule te permite crear un legado digital único para tus seres queridos.",
    },
    {
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2-pLtyTLGv0NlQjOK3KwmKTI6Tmmypkk.png",
      title: "Crecimiento a Través del Tiempo",
      description: "Documenta tu evolución año tras año, creando un tesoro de recuerdos.",
    },
    {
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%2029%20ago%202025%2C%2008_42_35%20p.m.-JfPLBdDkKSfIzqcyU6e7E0eGGMwdx1.png",
      title: "Memorias que Inspiran",
      description: "Cada video anual se convierte en una ventana a tu crecimiento personal.",
    },
    {
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%2029%20ago%202025%2C%2008_46_42%20p.m.-8nEBJCuaaZ3BZ2v8SlDDTLMuXYNxbm.png",
      title: "Legado Eterno",
      description: "Tus seres queridos podrán acceder a tus recuerdos cuando más los necesiten.",
    },
    {
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%2029%20ago%202025%2C%2008_53_36%20p.m.-pIAP8nAyGlQCxB4MYuDCpE5Ie6pVPD.png",
      title: "Conexión Perpetua",
      description: "Mantén viva la conexión con quienes amas, incluso después de partir.",
    },
  ]

  if (showIntro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardContent className="p-6">
            <div className="aspect-[3/2] mb-4 rounded-lg overflow-hidden bg-gray-100">
              <img
                src={introSlides[currentSlide].image || "/placeholder.svg"}
                alt={introSlides[currentSlide].title}
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-2xl font-bold text-center mb-2 text-balance">{introSlides[currentSlide].title}</h2>
            <p className="text-muted-foreground text-center mb-6 text-pretty leading-relaxed">
              {introSlides[currentSlide].description}
            </p>
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                {introSlides.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${index === currentSlide ? "bg-rose-600" : "bg-gray-300"}`}
                  />
                ))}
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setShowIntro(false)}>
                  Saltar
                </Button>
                <Button
                  onClick={() => {
                    if (currentSlide < introSlides.length - 1) {
                      setCurrentSlide(currentSlide + 1)
                    } else {
                      setShowIntro(false)
                    }
                  }}
                >
                  {currentSlide < introSlides.length - 1 ? "Siguiente" : "Comenzar"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isConfigured) {
    const getMinDate = () => {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      return tomorrow.toISOString().split("T")[0]
    }

    const handleDateSubmit = async () => {
      if (!reminderDate || !user) return

      try {
        const { error } = await supabase.from("profiles").upsert({
          id: user.id,
          annual_reminder_date: reminderDate,
          updated_at: new Date().toISOString(),
        })

        if (!error) {
          setIsConfigured(true)
        }
      } catch (error) {
        console.error("Error saving reminder date:", error)
      }
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <PadlockHeartIcon className="w-8 h-8 text-rose-600" />
            </div>
            <CardTitle className="text-2xl">¡Bienvenido a TimeCapsule!</CardTitle>
            <CardDescription>Configura tu primer recordatorio para comenzar tu legado digital</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="reminderDate">¿Cuándo quieres grabar tu primer video?</Label>
              <Input
                id="reminderDate"
                type="date"
                value={reminderDate}
                min={getMinDate()}
                onChange={(e) => setReminderDate(e.target.value)}
                className="mt-2"
              />
            </div>
            <Button onClick={handleDateSubmit} className="w-full" disabled={!reminderDate}>
              Configurar Recordatorio
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <PadlockHeartIcon className="w-10 h-10 text-rose-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">TimeCapsule</h1>
          <p className="text-muted-foreground">Tu legado digital para las futuras generaciones</p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                <Video className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg">Tu Video de Vida</CardTitle>
              <CardDescription className="text-sm leading-relaxed">Graba y gestiona tus videos anuales</CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle className="text-lg">Información Personalizada</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Contenido especial para cada contacto
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-lg">Contactos</CardTitle>
              <CardDescription className="text-sm leading-relaxed">Gestiona tu lista de seres queridos</CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-2">
                <PadlockHeartIcon className="w-6 h-6 text-orange-600" />
              </div>
              <CardTitle className="text-lg">Sistema de Legado</CardTitle>
              <CardDescription className="text-sm leading-relaxed">Configura tu legado digital</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Button
            variant="outline"
            onClick={async () => {
              await supabase.auth.signOut()
              router.push("/auth/login")
            }}
          >
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </div>
  )
}
