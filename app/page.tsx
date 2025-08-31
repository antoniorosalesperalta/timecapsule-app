"use client"

import {
  Users,
  Video,
  FileText,
  Calendar,
  Play,
  Trash2,
  Edit,
  ArrowLeft,
  Plus,
  Eye,
  Shield,
  Clock,
  Mail,
  Heart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
  const router = useRouter()
  const supabase = createClient()

  const [currentView, setCurrentView] = useState("dashboard")
  const [showIntro, setShowIntro] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isConfigured, setIsConfigured] = useState(false)
  const [reminderDate, setReminderDate] = useState("")
  const [familyContacts, setFamilyContacts] = useState([])
  const [trustedContact, setTrustedContact] = useState("")
  const [lastCheckIn, setLastCheckIn] = useState(new Date().toLocaleDateString("es-ES"))
  const [newContact, setNewContact] = useState({ name: "", email: "", relation: "", rut: "" })
  const [editingContact, setEditingContact] = useState(null)
  const [newTrustedEmail, setNewTrustedEmail] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [recordedVideos, setRecordedVideos] = useState([])
  const [personalizedVideos, setPersonalizedVideos] = useState([])
  const [playingVideo, setPlayingVideo] = useState(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [hasRecordedThisYear, setHasRecordedThisYear] = useState(false)
  const [personalizedInfo, setPersonalizedInfo] = useState({})
  const [selectedContactForInfo, setSelectedContactForInfo] = useState(null)
  const [newPersonalizedContent, setNewPersonalizedContent] = useState({
    title: "",
    type: "text",
    content: "",
    file: null,
  })
  const [showAddContent, setShowAddContent] = useState(false)
  const [recordingPersonalized, setRecordingPersonalized] = useState(null)
  const [personalizedRecordingTime, setPersonalizedRecordingTime] = useState(0)

  const videoRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const streamRef = useRef(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("[v0] Starting auth check")
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.log("[v0] Auth error:", error)
          setLoading(false)
          router.push("/auth/login")
          return
        }

        if (!session) {
          console.log("[v0] No session found, redirecting to login")
          setLoading(false)
          router.push("/auth/login")
          return
        }

        console.log("[v0] User authenticated:", session.user.email)
        setUser(session.user)
        await loadUserData(session.user.id)
        setLoading(false)
      } catch (error) {
        console.error("[v0] Auth check failed:", error)
        setLoading(false)
        router.push("/auth/login")
      }
    }

    checkAuth()
  }, [router])

  const loadUserData = async (userId) => {
    try {
      console.log("[v0] Loading user data for:", userId)
      // Load profile data
      const { data: profile } = await supabase
        .from("profiles")
        .select("annual_reminder_date, last_check_in, show_intro")
        .eq("id", userId)
        .single()

      console.log("[v0] Profile data:", profile)

      if (profile) {
        if (profile.annual_reminder_date) {
          setReminderDate(profile.annual_reminder_date)
          setIsConfigured(true)
          setShowIntro(profile.show_intro === true)
        } else {
          setIsConfigured(false)
          setShowIntro(false)
        }
      } else {
        setIsConfigured(false)
        setShowIntro(false)
      }

      // Load other data...
      const { data: contacts } = await supabase.from("contacts").select("*").eq("user_id", userId)

      if (contacts) {
        setFamilyContacts(contacts)
      }
    } catch (error) {
      console.error("[v0] Error loading user data:", error)
    }
  }

  const handleDateSubmit = async () => {
    if (!reminderDate || !user) {
      console.log("[v0] Missing reminder date or user")
      return
    }

    try {
      console.log("[v0] Saving reminder date:", reminderDate)
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        annual_reminder_date: reminderDate,
        show_intro: true, // Set show_intro to true after saving date
        updated_at: new Date().toISOString(),
      })

      if (error) {
        console.error("[v0] Error saving reminder date:", error)
        return
      }

      console.log("[v0] Reminder date saved successfully")
      setIsConfigured(true)
      setShowIntro(true) // Show intro after successful save
    } catch (error) {
      console.error("[v0] Error saving reminder date:", error)
    }
  }

  const startRecording = async (isPersonalized = false, contactId = null) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      const chunks = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: "video/webm" })
        const videoUrl = URL.createObjectURL(blob)

        const newVideo = {
          id: Date.now(),
          url: videoUrl,
          blob: blob,
          date: new Date().toLocaleDateString("es-ES"),
          duration: isPersonalized ? personalizedRecordingTime : recordingTime,
          type: isPersonalized ? "personalized" : "annual",
          contactId: contactId,
        }

        if (isPersonalized) {
          setPersonalizedVideos((prev) => [...prev, newVideo])
          setRecordingPersonalized(null)
          setPersonalizedRecordingTime(0)
        } else {
          setRecordedVideos((prev) => [...prev, newVideo])
          setHasRecordedThisYear(true)
          setRecordingTime(0)
        }

        setIsRecording(false)
        stream.getTracks().forEach((track) => track.stop())
      }

      if (isPersonalized) {
        setRecordingPersonalized(contactId)
        setPersonalizedRecordingTime(0)
      } else {
        setIsRecording(true)
        setRecordingTime(0)
      }

      mediaRecorder.start()

      // Auto-stop after 60 seconds
      setTimeout(() => {
        if (mediaRecorder.state === "recording") {
          mediaRecorder.stop()
        }
      }, 60000)

      // Timer
      const timer = setInterval(() => {
        if (isPersonalized) {
          setPersonalizedRecordingTime((prev) => {
            if (prev >= 59) {
              clearInterval(timer)
              return 60
            }
            return prev + 1
          })
        } else {
          setRecordingTime((prev) => {
            if (prev >= 59) {
              clearInterval(timer)
              return 60
            }
            return prev + 1
          })
        }
      }, 1000)
    } catch (error) {
      console.error("Error accessing camera:", error)
      alert("No se pudo acceder a la cámara. Por favor, verifica los permisos.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop()
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
    }
  }

  const handleAddContact = async () => {
    if (!newContact.name || !newContact.email || !newContact.relation || !newContact.rut || !user) return

    try {
      const { data, error } = await supabase
        .from("contacts")
        .insert({
          user_id: user.id,
          name: newContact.name,
          email: newContact.email,
          relationship: newContact.relation,
          rut: newContact.rut,
        })
        .select()
        .single()

      if (!error && data) {
        setFamilyContacts((prev) => [
          ...prev,
          {
            id: data.id,
            name: data.name,
            email: data.email,
            relation: data.relationship,
            rut: data.rut,
          },
        ])
        setNewContact({ name: "", email: "", relation: "", rut: "" })

        // Initialize personalized info for new contact
        setPersonalizedInfo((prev) => ({
          ...prev,
          [data.id]: [],
        }))
      }
    } catch (error) {
      console.error("Error adding contact:", error)
    }
  }

  const handleEditContact = (contact) => {
    setEditingContact({
      ...contact,
      originalId: contact.id,
    })
  }

  const handleSaveEdit = async () => {
    if (!editingContact || !user) return

    try {
      const { error } = await supabase
        .from("contacts")
        .update({
          name: editingContact.name,
          email: editingContact.email,
          relationship: editingContact.relation,
          rut: editingContact.rut,
        })
        .eq("id", editingContact.originalId)

      if (!error) {
        setFamilyContacts((prev) =>
          prev.map((contact) =>
            contact.id === editingContact.originalId ? { ...editingContact, id: editingContact.originalId } : contact,
          ),
        )
        setEditingContact(null)
      }
    } catch (error) {
      console.error("Error updating contact:", error)
    }
  }

  const handleDeleteContact = async (contactId) => {
    if (!user) return

    try {
      const { error } = await supabase.from("contacts").delete().eq("id", contactId)

      if (!error) {
        setFamilyContacts((prev) => prev.filter((contact) => contact.id !== contactId))
        setPersonalizedInfo((prev) => {
          const updated = { ...prev }
          delete updated[contactId]
          return updated
        })
      }
    } catch (error) {
      console.error("Error deleting contact:", error)
    }
  }

  const handleSaveTrustedContact = async () => {
    if (!newTrustedEmail || !user) return

    try {
      const { error } = await supabase.from("trusted_contacts").upsert({
        user_id: user.id,
        email: newTrustedEmail,
      })

      if (!error) {
        setTrustedContact(newTrustedEmail)
        setNewTrustedEmail("")
      }
    } catch (error) {
      console.error("Error saving trusted contact:", error)
    }
  }

  const handleAddPersonalizedContent = () => {
    if (!selectedContactForInfo || !newPersonalizedContent.title) return

    const content = {
      id: Date.now(),
      title: newPersonalizedContent.title,
      type: newPersonalizedContent.type,
      content: newPersonalizedContent.content,
      file: newPersonalizedContent.file,
      date: new Date().toLocaleDateString("es-ES"),
    }

    setPersonalizedInfo((prev) => ({
      ...prev,
      [selectedContactForInfo]: [...(prev[selectedContactForInfo] || []), content],
    }))

    setNewPersonalizedContent({ title: "", type: "text", content: "", file: null })
    setShowAddContent(false)
  }

  const handleDeletePersonalizedContent = (contactId, contentId) => {
    setPersonalizedInfo((prev) => ({
      ...prev,
      [contactId]: prev[contactId].filter((item) => item.id !== contentId),
    }))
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

  if (currentView === "life-videos") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 p-4">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-8">
            <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <PadlockHeartIcon className="w-10 h-10 text-rose-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Tu Video de Vida</h1>
            <p className="text-muted-foreground">Gestiona tus videos anuales y personalizados</p>
          </header>

          <div className="grid gap-6 md:grid-cols-2 mb-8">
            {/* Video Completo de Vida */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="w-5 h-5" />
                  Video Completo de Vida
                </CardTitle>
                <CardDescription>Compilación de todos tus videos anuales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gray-100 rounded-lg p-4 text-center">
                    <Video className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600 mb-2">{recordedVideos.length} videos grabados</p>
                    <p className="text-xs text-gray-500">
                      Duración total: {recordedVideos.reduce((acc, video) => acc + (video.duration || 60), 0)} segundos
                    </p>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => {
                      if (recordedVideos.length > 0) {
                        setPlayingVideo({ type: "compiled", videos: recordedVideos })
                      }
                    }}
                    disabled={recordedVideos.length === 0}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Reproducir Video Completo
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Videos Independientes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Videos Independientes de Vida
                </CardTitle>
                <CardDescription>Tus videos anuales individuales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Video Anual */}
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Video Anual 2025</h4>
                      <span
                        className={`text-xs px-2 py-1 rounded ${hasRecordedThisYear ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                      >
                        {hasRecordedThisYear ? "Completado" : "Pendiente"}
                      </span>
                    </div>
                    {!hasRecordedThisYear ? (
                      <div className="space-y-2">
                        {isRecording ? (
                          <div className="text-center">
                            <video ref={videoRef} autoPlay muted className="w-full max-w-xs mx-auto rounded-lg mb-2" />
                            <p className="text-sm text-red-600 mb-2">Grabando... {recordingTime}s / 60s</p>
                            <Button onClick={stopRecording} variant="destructive" size="sm">
                              Detener Grabación
                            </Button>
                          </div>
                        ) : (
                          <Button onClick={() => startRecording()} className="w-full">
                            <Video className="w-4 h-4 mr-2" />
                            Comenzar Grabación
                          </Button>
                        )}
                        <p className="text-xs text-gray-500">
                          Solo puedes grabar un video por año para mantener la autenticidad del concepto.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {recordedVideos.map((video) => (
                          <div key={video.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <span className="text-sm">{video.date}</span>
                            <div className="flex gap-1">
                              <Button size="sm" variant="outline" onClick={() => setPlayingVideo(video)}>
                                <Play className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setRecordedVideos((prev) => prev.filter((v) => v.id !== video.id))
                                  setHasRecordedThisYear(false)
                                }}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Videos Personalizados */}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Videos Personalizados</h4>
                    <div className="space-y-2">
                      {familyContacts.map((contact) => {
                        const hasPersonalizedVideo = personalizedVideos.some((v) => v.contactId === contact.id)
                        const isRecordingForContact = recordingPersonalized === contact.id

                        return (
                          <div key={contact.id} className="flex items-center justify-between bg-purple-50 p-2 rounded">
                            <span className="text-sm">{contact.name}</span>
                            <div className="flex gap-1">
                              {!hasPersonalizedVideo && !isRecordingForContact && (
                                <Button size="sm" variant="outline" onClick={() => startRecording(true, contact.id)}>
                                  <Video className="w-3 h-3" />
                                </Button>
                              )}
                              {isRecordingForContact && (
                                <div className="text-center">
                                  <p className="text-xs text-red-600">Grabando... {personalizedRecordingTime}s</p>
                                  <Button onClick={stopRecording} variant="destructive" size="sm">
                                    Detener
                                  </Button>
                                </div>
                              )}
                              {hasPersonalizedVideo && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      const video = personalizedVideos.find((v) => v.contactId === contact.id)
                                      setPlayingVideo(video)
                                    }}
                                  >
                                    <Play className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setPersonalizedVideos((prev) => prev.filter((v) => v.contactId !== contact.id))
                                    }}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        )
                      })}
                      {familyContacts.length === 0 && (
                        <p className="text-xs text-gray-500">Agrega contactos para crear videos personalizados</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Button onClick={() => setCurrentView("dashboard")} variant="outline" className="w-full mt-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Inicio
          </Button>
        </div>

        {/* Video Player Modal */}
        {playingVideo && (
          <Dialog open={!!playingVideo} onOpenChange={() => setPlayingVideo(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {playingVideo.type === "compiled" ? "Video Compilado Final" : `Video - ${playingVideo.date}`}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {playingVideo.type === "compiled" ? (
                  <div>
                    <p className="text-sm text-gray-600 mb-4">
                      Reproduciendo {playingVideo.videos.length} videos en secuencia
                    </p>
                    {playingVideo.videos.map((video, index) => (
                      <video key={index} controls className="w-full mb-2 rounded-lg">
                        <source src={video.url} type="video/webm" />
                      </video>
                    ))}
                  </div>
                ) : (
                  <video controls className="w-full rounded-lg">
                    <source src={playingVideo.url} type="video/webm" />
                  </video>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    )
  }

  if (currentView === "personalized-info") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 p-4">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-8">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-purple-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Información Personalizada</h1>
            <p className="text-muted-foreground">Gestiona contenido específico para cada contacto</p>
          </header>

          <div className="grid gap-6">
            {familyContacts.length > 0 ? (
              familyContacts.map((contact) => (
                <Card key={contact.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{contact.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                          {personalizedInfo[contact.id]?.length || 0} archivos
                        </span>
                        <div className="flex items-center gap-1">
                          <input type="checkbox" id={`video-${contact.id}`} className="rounded" />
                          <label htmlFor={`video-${contact.id}`} className="text-xs">
                            Incluir video completo
                          </label>
                        </div>
                      </div>
                    </CardTitle>
                    <CardDescription>
                      {contact.email} • {contact.relation}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2 mb-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedContactForInfo(contact.id)
                          // Show files modal
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Ver Archivos
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedContactForInfo(contact.id)
                          setShowAddContent(true)
                        }}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Agregar
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="w-4 h-4 mr-1" />
                        Eliminar
                      </Button>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">
                        Contenido actual: {personalizedInfo[contact.id]?.length || 0} elementos
                      </p>
                      {personalizedInfo[contact.id]?.slice(0, 2).map((item) => (
                        <div key={item.id} className="text-xs text-gray-500 mt-1">
                          • {item.title} ({item.type})
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium mb-2">No hay contactos</h3>
                  <p className="text-gray-600 mb-4">
                    Primero agrega contactos familiares para gestionar información personalizada
                  </p>
                  <Button onClick={() => setCurrentView("contacts")}>Ir a Contactos</Button>
                </CardContent>
              </Card>
            )}
          </div>

          <Button onClick={() => setCurrentView("dashboard")} variant="outline" className="w-full mt-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Inicio
          </Button>
        </div>

        {/* Add Content Modal */}
        {showAddContent && (
          <Dialog open={showAddContent} onOpenChange={setShowAddContent}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar Contenido Personalizado</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={newPersonalizedContent.title}
                    onChange={(e) => setNewPersonalizedContent((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Ej: Carta de cumpleaños, Foto familiar..."
                  />
                </div>
                <div>
                  <Label htmlFor="type">Tipo de contenido</Label>
                  <Select
                    value={newPersonalizedContent.type}
                    onValueChange={(value) => setNewPersonalizedContent((prev) => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Texto</SelectItem>
                      <SelectItem value="image">Imagen</SelectItem>
                      <SelectItem value="document">Documento</SelectItem>
                      <SelectItem value="audio">Audio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {newPersonalizedContent.type === "text" ? (
                  <div>
                    <Label htmlFor="content">Contenido</Label>
                    <Textarea
                      id="content"
                      value={newPersonalizedContent.content}
                      onChange={(e) => setNewPersonalizedContent((prev) => ({ ...prev, content: e.target.value }))}
                      placeholder="Escribe tu mensaje personalizado..."
                      rows={4}
                    />
                  </div>
                ) : (
                  <div>
                    <Label htmlFor="file">Archivo</Label>
                    <Input
                      id="file"
                      type="file"
                      onChange={(e) => setNewPersonalizedContent((prev) => ({ ...prev, file: e.target.files[0] }))}
                    />
                  </div>
                )}
                <div className="flex gap-2">
                  <Button onClick={handleAddPersonalizedContent} className="flex-1">
                    Agregar Contenido
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddContent(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    )
  }

  if (currentView === "contacts") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 p-4">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Contactos</h1>
            <p className="text-muted-foreground">Gestiona tu lista de seres queridos</p>
          </header>

          <div className="grid gap-6">
            {/* Agregar Nuevo Contacto */}
            <Card>
              <CardHeader>
                <CardTitle>Agregar Nuevo Contacto</CardTitle>
                <CardDescription>Información de tus seres queridos que recibirán tu TimeCapsule</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Nombre Completo</Label>
                    <Input
                      id="name"
                      value={newContact.name}
                      onChange={(e) => setNewContact((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Ej: María González"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newContact.email}
                      onChange={(e) => setNewContact((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="maria@ejemplo.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="relation">Relación</Label>
                    <Select
                      value={newContact.relation}
                      onValueChange={(value) => setNewContact((prev) => ({ ...prev, relation: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona relación" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="madre">Madre</SelectItem>
                        <SelectItem value="padre">Padre</SelectItem>
                        <SelectItem value="hermana">Hermana</SelectItem>
                        <SelectItem value="hermano">Hermano</SelectItem>
                        <SelectItem value="hija">Hija</SelectItem>
                        <SelectItem value="hijo">Hijo</SelectItem>
                        <SelectItem value="esposa">Esposa</SelectItem>
                        <SelectItem value="esposo">Esposo</SelectItem>
                        <SelectItem value="amiga">Amiga</SelectItem>
                        <SelectItem value="amigo">Amigo</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="rut">RUT</Label>
                    <Input
                      id="rut"
                      value={newContact.rut}
                      onChange={(e) => setNewContact((prev) => ({ ...prev, rut: e.target.value }))}
                      placeholder="12.345.678-9"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleAddContact}
                  className="w-full mt-4"
                  disabled={!newContact.name || !newContact.email || !newContact.relation || !newContact.rut}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Guardar Contacto
                </Button>
              </CardContent>
            </Card>

            {/* Lista de Contactos Familiares */}
            <Card>
              <CardHeader>
                <CardTitle>Contactos Familiares ({familyContacts.length})</CardTitle>
                <CardDescription>Personas que recibirán tu TimeCapsule</CardDescription>
              </CardHeader>
              <CardContent>
                {familyContacts.length > 0 ? (
                  <div className="space-y-3">
                    {familyContacts.map((contact) => (
                      <div key={contact.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        {editingContact?.originalId === contact.id ? (
                          <div className="flex-1 grid grid-cols-4 gap-2 mr-4">
                            <Input
                              value={editingContact.name}
                              onChange={(e) => setEditingContact((prev) => ({ ...prev, name: e.target.value }))}
                              placeholder="Nombre"
                            />
                            <Input
                              value={editingContact.email}
                              onChange={(e) => setEditingContact((prev) => ({ ...prev, email: e.target.value }))}
                              placeholder="Email"
                            />
                            <Input
                              value={editingContact.relation}
                              onChange={(e) => setEditingContact((prev) => ({ ...prev, relation: e.target.value }))}
                              placeholder="Relación"
                            />
                            <Input
                              value={editingContact.rut}
                              onChange={(e) => setEditingContact((prev) => ({ ...prev, rut: e.target.value }))}
                              placeholder="RUT"
                            />
                          </div>
                        ) : (
                          <div className="flex-1">
                            <h4 className="font-medium">{contact.name}</h4>
                            <p className="text-sm text-gray-600">
                              {contact.email} • {contact.relation}
                            </p>
                            <p className="text-xs text-gray-500">RUT: {contact.rut}</p>
                          </div>
                        )}
                        <div className="flex gap-2">
                          {editingContact?.originalId === contact.id ? (
                            <>
                              <Button size="sm" onClick={handleSaveEdit}>
                                Guardar
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => setEditingContact(null)}>
                                Cancelar
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button size="sm" variant="outline" onClick={() => handleEditContact(contact)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleDeleteContact(contact.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">No hay contactos agregados aún</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Button onClick={() => setCurrentView("dashboard")} variant="outline" className="w-full mt-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Inicio
          </Button>
        </div>
      </div>
    )
  }

  if (currentView === "legacy-system") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 p-4">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-8">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <PadlockHeartIcon className="w-10 h-10 text-orange-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Sistema de Legado</h1>
            <p className="text-muted-foreground">Configura cómo se activará tu TimeCapsule</p>
          </header>

          <div className="space-y-6">
            {/* Contacto de Confianza */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Contacto de Confianza
                </CardTitle>
                <CardDescription>Persona responsable de activar el envío de tu TimeCapsule</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="trustedEmail">Email del Contacto de Confianza</Label>
                  <Input
                    id="trustedEmail"
                    type="email"
                    value={newTrustedEmail}
                    onChange={(e) => setNewTrustedEmail(e.target.value)}
                    placeholder="contacto@ejemplo.com"
                  />
                </div>
                <Button onClick={handleSaveTrustedContact} disabled={!newTrustedEmail}>
                  <Mail className="w-4 h-4 mr-2" />
                  Guardar Contacto de Confianza
                </Button>
                {trustedContact && (
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-green-700">
                      <strong>Contacto actual:</strong> {trustedContact}
                    </p>
                  </div>
                )}

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Responsabilidades del contacto de confianza:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Activar manualmente el envío del TimeCapsule cuando sea necesario</li>
                    <li>• Responder a las verificaciones anuales si no puedes hacerlo</li>
                    <li>• Asegurar que el código QR llegue a los familiares para la lápida</li>
                    <li>• Ser el punto de contacto para gestionar tu legado digital</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Sistema de Verificación */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Sistema de Verificación Anual
                </CardTitle>
                <CardDescription>Verificación automática de actividad para activar el legado</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-green-900">Estado del Sistema</h4>
                    <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">Activo</span>
                  </div>
                  <p className="text-sm text-green-800 mb-2">
                    <strong>Último check-in:</strong> {lastCheckIn}
                  </p>
                  <p className="text-xs text-green-700">
                    El sistema verifica tu actividad anualmente. Si no respondes en 30 días, se notifica a tu contacto
                    de confianza.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Cómo funciona:</h4>
                  <ol className="text-sm text-gray-700 space-y-1">
                    <li>1. Cada año recibes un email de verificación</li>
                    <li>2. Tienes 30 días para responder</li>
                    <li>3. Si no respondes, se notifica a tu contacto de confianza</li>
                    <li>4. Tu contacto puede activar el envío del TimeCapsule</li>
                  </ol>
                </div>
              </CardContent>
            </Card>

            {/* Contenido del TimeCapsule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Contenido del TimeCapsule
                </CardTitle>
                <CardDescription>Resumen de lo que se incluirá en tu legado digital</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Videos Anuales</h4>
                      <p className="text-sm text-blue-800">{recordedVideos.length} videos grabados</p>
                      <p className="text-xs text-blue-700">Compilación cronológica de tu crecimiento</p>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-medium text-purple-900 mb-2">Videos Personalizados</h4>
                      <p className="text-sm text-purple-800">{personalizedVideos.length} videos específicos</p>
                      <p className="text-xs text-purple-700">Mensajes únicos para cada contacto</p>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-2">Información Personalizada</h4>
                      <p className="text-sm text-green-800">
                        {Object.values(personalizedInfo).flat().length} elementos
                      </p>
                      <p className="text-xs text-green-700">Contenido específico por contacto</p>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h4 className="font-medium text-orange-900 mb-2">Código QR</h4>
                      <p className="text-sm text-orange-800">Para acceso desde lápida</p>
                      <p className="text-xs text-orange-700">Enlace permanente a tu legado</p>
                    </div>
                  </div>

                  <div className="bg-rose-50 p-4 rounded-lg">
                    <h4 className="font-medium text-rose-900 mb-2">Proceso de Envío</h4>
                    <ul className="text-sm text-rose-800 space-y-1">
                      <li>• Cada contacto recibe su video compilado personalizado</li>
                      <li>• Se incluye el código QR para la lápida</li>
                      <li>• Los familiares pueden acceder al contenido completo</li>
                      <li>• El legado permanece disponible permanentemente</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Button onClick={() => setCurrentView("dashboard")} variant="outline" className="w-full mt-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Inicio
          </Button>
        </div>
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
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setCurrentView("life-videos")}
          >
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
            onClick={() => setCurrentView("personalized-info")}
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

          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setCurrentView("legacy-system")}
          >
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
