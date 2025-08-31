"use client"

import { Users, Video, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect, useRef } from "react"
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
  const [showIntro, setShowIntro] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [currentView, setCurrentView] = useState("dashboard")
  const [reminderDate, setReminderDate] = useState("")
  const [familyContacts, setFamilyContacts] = useState([])
  const [newContact, setNewContact] = useState({ name: "", email: "", relation: "", rut: "" })
  const [editingContact, setEditingContact] = useState(null)
  const [trustedContact, setTrustedContact] = useState({ email: "", name: "" })
  const [personalizedFiles, setPersonalizedFiles] = useState({})
  const [selectedContact, setSelectedContact] = useState(null)
  const [showFileModal, setShowFileModal] = useState(false)
  const [newFile, setNewFile] = useState({ title: "", type: "text", content: "", file: null })
  const [isRecording, setIsRecording] = useState(false)
  const [recordedVideo, setRecordedVideo] = useState(null)
  const [mediaRecorder, setMediaRecorder] = useState(null)
  const [stream, setStream] = useState(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [playingVideo, setPlayingVideo] = useState(null)
  const [videoBlobs, setVideoBlobs] = useState({})
  const [lifeVideos, setLifeVideos] = useState([
    { id: 1, year: 2024, duration: "1:00", recorded: true },
    { id: 2, year: 2025, duration: "0:45", recorded: true },
  ])

  const router = useRouter()
  const supabase = createClient()
  const videoRef = useRef(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          router.push("/auth/login")
          return
        }

        setUser(session.user)
        setLoading(false)
        setShowIntro(true) // Always show intro for now
      } catch (error) {
        console.error("Auth error:", error)
        router.push("/auth/login")
      }
    }

    checkAuth()
  }, [router])

  const handleDateSubmit = () => {
    if (reminderDate) {
      setShowIntro(false)
    }
  }

  const handleCloseVideo = () => {
    setPlayingVideo(null)
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

  if (!user) {
    return null
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
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%2029%20ago%202025%2C%2008_46_42%20p.m.-QF5Mc.png",
      title: "Legado Eterno",
      description: "Tus videos se convierten en un tesoro para las futuras generaciones.",
    },
    {
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%2029%20ago%202025%2C%2008_53_36%20p.m.-rb3eb.png",
      title: "Conexión Perpetua",
      description: "Mantén viva la conexión con tus seres queridos a través del tiempo.",
    },
  ]

  if (showIntro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PadlockHeartIcon className="w-8 h-8 text-rose-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">TimeCapsule</h1>
            </div>

            <div className="space-y-4">
              <div className="aspect-[3/2] mb-4 rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={introSlides[currentSlide].image || "/placeholder.svg"}
                  alt={introSlides[currentSlide].title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2 text-balance">{introSlides[currentSlide].title}</h2>
                <p className="text-muted-foreground text-pretty leading-relaxed">
                  {introSlides[currentSlide].description}
                </p>
              </div>

              <div className="flex justify-center space-x-2 my-4">
                {introSlides.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${index === currentSlide ? "bg-rose-600" : "bg-gray-300"}`}
                  />
                ))}
              </div>

              <div className="flex justify-between">
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

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setCurrentView("videos")}>
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                <Video className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg min-w-0">Tu Video de Vida</CardTitle>
              <CardDescription className="text-sm leading-relaxed text-pretty">
                Graba y gestiona tus videos anuales
              </CardDescription>
            </CardHeader>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setCurrentView("personalized")}
          >
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle className="text-lg min-w-0">Información Personalizada</CardTitle>
              <CardDescription className="text-sm leading-relaxed text-pretty">
                Contenido especial para cada contacto
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setCurrentView("contacts")}>
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-lg min-w-0">Contactos</CardTitle>
              <CardDescription className="text-sm leading-relaxed text-pretty">
                Gestiona tu lista de seres queridos
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setCurrentView("legacy")}>
            <CardHeader>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-2">
                <PadlockHeartIcon className="w-6 h-6 text-orange-600" />
              </div>
              <CardTitle className="text-lg min-w-0">Sistema de Legado</CardTitle>
              <CardDescription className="text-sm leading-relaxed text-pretty">
                Configura tu legado digital
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {currentView !== "dashboard" && (
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle>
                  {currentView === "videos" && "Tu Video de Vida"}
                  {currentView === "personalized" && "Información Personalizada"}
                  {currentView === "contacts" && "Contactos"}
                  {currentView === "legacy" && "Sistema de Legado"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentView === "videos" && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">Sección de videos en desarrollo</p>
                    <Button onClick={() => setCurrentView("dashboard")}>Volver al Inicio</Button>
                  </div>
                )}
                {currentView === "personalized" && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">Información personalizada en desarrollo</p>
                    <Button onClick={() => setCurrentView("dashboard")}>Volver al Inicio</Button>
                  </div>
                )}
                {currentView === "contacts" && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">Gestión de contactos en desarrollo</p>
                    <Button onClick={() => setCurrentView("dashboard")}>Volver al Inicio</Button>
                  </div>
                )}
                {currentView === "legacy" && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">Sistema de legado en desarrollo</p>
                    <Button onClick={() => setCurrentView("dashboard")}>Volver al Inicio</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        <div className="text-center">
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
