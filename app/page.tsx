"use client"

import { ArrowLeft, Play, Trash2, UserPlus, Users, Video, Calendar, FileText, Plus, User, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { uploadVideoBlob, saveVideoToDatabase, deleteVideoBlob } from "./actions/blob-actions"

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

  const [currentView, setCurrentView] = useState<
    | "dashboard"
    | "lifeVideo"
    | "completeLifeVideo"
    | "independentLifeVideos"
    | "personalizedInfo"
    | "contacts"
    | "legacy"
  >("dashboard")
  const [showIntro, setShowIntro] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isConfigured, setIsConfigured] = useState(false)
  const [reminderDate, setReminderDate] = useState("")

  const [viewingCompiled, setViewingCompiled] = useState(false)
  const [viewingPersonalized, setViewingPersonalized] = useState(false)
  const [recordedVideos, setRecordedVideos] = useState([])
  const [personalizedVideos, setPersonalizedVideos] = useState([])
  const [familyContacts, setFamilyContacts] = useState([])
  const [trustedContact, setTrustedContact] = useState("")
  const [lastCheckIn, setLastCheckIn] = useState(
    new Date().toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  )
  const [editingContact, setEditingContact] = useState(null)
  const [editForm, setEditForm] = useState({ name: "", email: "", relation: "", rut: "" })
  const [isAddingContact, setIsAddingContact] = useState(false)
  const [newContactName, setNewContactName] = useState("")
  const [newContactEmail, setNewContactEmail] = useState("")
  const [newContactRelation, setNewContactRelation] = useState("")
  const [newContactRut, setNewContactRut] = useState("")
  const [playingVideo, setPlayingVideo] = useState(null)
  const [videoBlobs, setVideoBlobs] = useState({})
  const [newContact, setNewContact] = useState({ name: "", email: "", relation: "", rut: "" })
  const [personalizedInfoSettings, setPersonalizedInfoSettings] = useState({})
  const [stream, setStream] = useState(null)
  const [mediaRecorder, setMediaRecorder] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [recordingType, setRecordingType] = useState("")
  const [selectedContact, setSelectedContact] = useState(null)
  const cameraRef = useRef(null)

  const [personalizedContent, setPersonalizedContent] = useState({})
  const [showFileManager, setShowFileManager] = useState(null)
  const [showAddContent, setShowAddContent] = useState(null)
  const [newContentForm, setNewContentForm] = useState({ title: "", type: "document", file: null })

  useEffect(() => {
    const checkAuth = async () => {
      console.log("[v0] Starting auth check")
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        console.log("[v0] Session result:", { session: !!session, error })

        if (error) {
          console.error("Auth error:", error)
          router.push("/auth/login")
          return
        }

        if (!session) {
          console.log("[v0] No session, redirecting to login")
          router.push("/auth/login")
          return
        }

        console.log("[v0] Session found, setting user and loading data")
        setUser(session.user)
        await loadUserData(session.user.id)
        console.log("[v0] Data loaded, setting loading to false")
      } catch (error) {
        console.error("Session check failed:", error)
        router.push("/auth/login")
      } finally {
        console.log("[v0] Setting loading to false in finally block")
        setLoading(false)
      }
    }

    checkAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("[v0] Auth state change:", event, !!session)
      if (event === "SIGNED_OUT" || !session) {
        setUser(null)
        router.push("/auth/login")
      } else if (session) {
        setUser(session.user)
        await loadUserData(session.user.id)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    let interval = null
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } else {
      setRecordingTime(0)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRecording])

  const loadUserData = async (userId) => {
    console.log("[v0] Loading user data for:", userId)
    try {
      // Load profile data
      try {
        console.log("[v0] Loading profile...")
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single()

        console.log("[v0] Profile result:", { profile: !!profile, error: profileError })

        if (profile) {
          setReminderDate(profile.annual_reminder_date || "")
          setIsConfigured(!!profile.annual_reminder_date)
          if (profile.last_check_in) {
            setLastCheckIn(
              new Date(profile.last_check_in).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
            )
          }
        }
      } catch (error) {
        console.error("[v0] Error loading profile:", error)
      }

      // Load contacts
      try {
        console.log("[v0] Loading contacts...")
        const { data: contacts, error: contactsError } = await supabase
          .from("contacts")
          .select("*")
          .eq("user_id", userId)

        console.log("[v0] Contacts result:", { count: contacts?.length, error: contactsError })

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
      } catch (error) {
        console.error("[v0] Error loading contacts:", error)
      }

      // Load trusted contact
      try {
        console.log("[v0] Loading trusted contact...")
        const { data: trustedContacts, error: trustedError } = await supabase
          .from("trusted_contacts")
          .select("*")
          .eq("user_id", userId)
          .single()

        console.log("[v0] Trusted contact result:", { data: !!trustedContacts, error: trustedError })

        if (trustedContacts) {
          setTrustedContact(trustedContacts.email)
        }
      } catch (error) {
        console.error("[v0] Error loading trusted contact:", error)
      }

      console.log("[v0] User data loading completed")
    } catch (error) {
      console.error("[v0] Error loading user data:", error)
    }
  }

  const handleSaveContacts = async () => {
    if (!user) return

    try {
      const { error } = await supabase.from("contacts").insert({
        user_id: user.id,
        name: newContact.name,
        email: newContact.email,
        relationship: newContact.relation,
        rut: newContact.rut,
      })

      if (error) throw error

      // Reload contacts
      await loadUserData(user.id)

      // Clear form
      setNewContact({ name: "", email: "", relation: "", rut: "" })
      setIsAddingContact(false)

      alert("Contacto guardado exitosamente")
    } catch (error) {
      console.error("Error saving contact:", error)
      alert("Error al guardar el contacto")
    }
  }

  const handleSaveTrustedContact = async () => {
    if (!user || !trustedContact) return

    try {
      const { error } = await supabase.from("trusted_contacts").upsert({
        user_id: user.id,
        email: trustedContact,
      })

      if (error) throw error

      alert("Contacto de confianza guardado exitosamente")
    } catch (error) {
      console.error("Error saving trusted contact:", error)
      alert("Error al guardar el contacto de confianza")
    }
  }

  const handleSaveReminderDate = async () => {
    if (!user || !reminderDate) return

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          annual_reminder_date: reminderDate,
          last_check_in: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) throw error

      setIsConfigured(true)
      setShowIntro(false)
      alert("Fecha de recordatorio guardada exitosamente")
    } catch (error) {
      console.error("Error saving reminder date:", error)
      alert("Error al guardar la fecha de recordatorio")
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      router.push("/auth/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const handleDeleteVideo = async (videoId) => {
    const videoToDelete = recordedVideos.find((v) => v.id === videoId)

    if (videoToDelete && videoToDelete.blobUrl) {
      const result = await deleteVideoBlob(videoToDelete.blobUrl)
      if (!result.success) {
        console.error("Error deleting video from Blob storage:", result.error)
      }
    }

    // Delete from database
    if (user) {
      try {
        const { error } = await supabase.from("videos").delete().eq("id", videoId).eq("user_id", user.id)

        if (error) throw error
      } catch (error) {
        console.error("Error deleting video from database:", error)
      }
    }

    setRecordedVideos((prev) => prev.filter((video) => video.id !== videoId))
    setVideoBlobs((prev) => {
      const newBlobs = { ...prev }
      delete newBlobs[videoId]
      return newBlobs
    })
  }

  const startRecording = async () => {
    let localStream = null
    let localMediaRecorder = null

    try {
      localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      setStream(localStream)

      localMediaRecorder = new MediaRecorder(localStream)
      const chunks = []

      localMediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }

      localMediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: "video/webm" })

        try {
          const filename = `video-${Date.now()}.webm`

          const uploadResult = await uploadVideoBlob(blob, filename)

          if (!uploadResult.success) {
            throw new Error(uploadResult.error)
          }

          const videoData = {
            user_id: user.id,
            year: new Date().getFullYear(),
            video_type: recordingType === "annual" ? "annual" : "personal",
            blob_url: uploadResult.url,
            duration: 60, // 1 minute default
            contact_id: recordingType === "personalized" && selectedContact ? selectedContact.id : null,
          }

          const saveResult = await saveVideoToDatabase(videoData)

          if (!saveResult.success) {
            throw new Error(saveResult.error)
          }

          // Update local state
          if (recordingType === "annual") {
            const newVideo = {
              id: Date.now().toString(),
              title: `Video Anual ${new Date().getFullYear()}`,
              year: new Date().getFullYear().toString(),
              duration: "1:00",
              blob: uploadResult.url,
              blobUrl: uploadResult.url,
            }
            setRecordedVideos((prev) => [...prev, newVideo])
          } else if (recordingType === "personalized" && selectedContact) {
            const newVideo = {
              id: Date.now().toString(),
              title: `Mensaje para ${selectedContact.name}`,
              contactName: selectedContact.name,
              year: new Date().getFullYear().toString(),
              duration: "1:00",
              blob: uploadResult.url,
              blobUrl: uploadResult.url,
            }
            setPersonalizedVideos((prev) => [...prev, newVideo])
          }

          setVideoBlobs((prev) => ({
            ...prev,
            [Date.now().toString()]: uploadResult.url,
          }))
        } catch (error) {
          console.error("Error uploading video:", error)
          alert("Error al subir el video. Por favor, intenta de nuevo.")
        }

        localStream.getTracks().forEach((track) => track.stop())
        setStream(null)
        setIsRecording(false)
        setRecordingTime(0)
      }

      setMediaRecorder(localMediaRecorder)
      localMediaRecorder.start()
      setIsRecording(true)

      // Auto-stop after 60 seconds
      setTimeout(() => {
        if (localMediaRecorder.state === "recording") {
          localMediaRecorder.stop()
        }
      }, 60000)
    } catch (error) {
      console.error("Error accessing camera:", error)
      alert("No se pudo acceder a la cámara. Por favor, verifica los permisos.")
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop())
      }
      setStream(null)
      setIsRecording(false)
      setRecordingTime(0)
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
      description:
        "TimeCapsule te permite crear un legado digital único para tus seres queridos, preservando tus momentos más preciados a través de los años.",
    },
    {
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2-pLtyTLGv0NlQjOK3KwmKTI6Tmmypkk.png",
      title: "Crecimiento a Través del Tiempo",
      description:
        "Documenta tu evolución personal año tras año. Desde los 8 hasta los 80 años, cada video captura una etapa única de tu vida.",
    },
    {
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%2029%20ago%202025%2C%2008_42_35%20p.m.-JfPLBdDkKSfIzqcyU6e7E0eGGMwdx1.png",
      title: "Memorias que Inspiran",
      description:
        "Graba un video de 1 minuto cada año. Comparte tus pensamientos, sueños y sabiduría para crear un tesoro emocional duradero.",
    },
    {
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%2029%20ago%202025%2C%2008_46_42%20p.m.-8nEBJCuaaZ3BZ2v8SlDDTLMuXYNxbm.png",
      title: "Legado Eterno",
      description:
        "Cuando llegue el momento, tus videos se compilarán automáticamente y se enviarán a tus contactos junto con un código QR para tu lápida.",
    },
    {
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%2029%20ago%202025%2C%2008_53_36%20p.m.-pIAP8nAyGlQCxB4MYuDCpE5Ie6pVPD.png",
      title: "Conexión Continua",
      description:
        "Tus seres queridos podrán acceder a tus videos a través del código QR, manteniendo viva tu presencia y tus enseñanzas para siempre.",
    },
  ]

  const getMinDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split("T")[0]
  }

  const getTotalDuration = () => {
    const totalSeconds = recordedVideos.reduce((acc, video) => {
      const [minutes, seconds] = video.duration.split(":").map(Number)
      return acc + minutes * 60 + seconds
    }, 0)

    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const handlePlayVideo = (videoId) => {
    setPlayingVideo(videoId)
  }

  const handleCloseVideo = () => {
    setPlayingVideo(null)
  }

  const handleDeletePersonalizedVideo = (videoId) => {
    setPersonalizedVideos((prevVideos) => prevVideos.filter((video) => video.id !== videoId))
  }

  const handleEditContact = (contact) => {
    setEditingContact(contact.id)
    setEditForm({ name: contact.name, email: contact.email, relation: contact.relation, rut: contact.rut })
  }

  const handleSaveEdit = () => {
    setFamilyContacts((prevContacts) =>
      prevContacts.map((contact) =>
        contact.id === editingContact
          ? {
              ...contact,
              name: editForm.name,
              email: editForm.email,
              relation: editForm.relation,
              rut: editForm.rut,
            }
          : contact,
      ),
    )
    setEditingContact(null)
  }

  const handleCancelEdit = () => {
    setEditingContact(null)
  }

  const handleDeleteContact = (contactId) => {
    setFamilyContacts((prevContacts) => prevContacts.filter((contact) => contact.id !== contactId))
  }

  const handleAddContact = () => {
    if (!newContact.name || !newContact.email || !newContact.relation || !newContact.rut) {
      alert("Por favor completa todos los campos")
      return
    }

    const contactToAdd = {
      id: String(Date.now()),
      name: newContact.name,
      email: newContact.email,
      relation: newContact.relation,
      rut: newContact.rut,
    }
    setFamilyContacts((prevContacts) => [...prevContacts, contactToAdd])
    // Clear form properly
    setNewContact({ name: "", email: "", relation: "", rut: "" })
    setIsAddingContact(false)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % introSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + introSlides.length) % introSlides.length)
  }

  const skipIntro = () => {
    setShowIntro(false)
  }

  const handleConfigureReminder = () => {
    if (reminderDate) {
      setIsConfigured(true)
      setShowIntro(false)
      alert(`Recordatorio configurado para ${reminderDate}`)
    }
  }

  const toggleVideoOption = (contactId) => {
    setPersonalizedInfoSettings((prev) => ({
      ...prev,
      [contactId]: {
        ...prev[contactId],
        includeLifeVideo: !prev[contactId]?.includeLifeVideo,
      },
    }))
  }

  const handleViewFiles = (contactId, contactName) => {
    setShowFileManager(contactId)
  }

  const handleAddContent = (contactId) => {
    setShowAddContent(contactId)
    setNewContentForm({ title: "", type: "document", file: null })
  }

  const handleSaveContent = async (contactId) => {
    if (!newContentForm.title || !newContentForm.file) {
      alert("Por favor completa todos los campos")
      return
    }

    const newContent = {
      id: Date.now(),
      title: newContentForm.title,
      type: newContentForm.type,
      fileName: newContentForm.file.name,
      dateAdded: new Date().toLocaleDateString(),
      file: newContentForm.file,
    }

    setPersonalizedContent((prev) => ({
      ...prev,
      [contactId]: [...(prev[contactId] || []), newContent],
    }))

    setShowAddContent(null)
    setNewContentForm({ title: "", type: "document", file: null })
  }

  const handleDeleteContent = (contactId, contentId) => {
    if (confirm("¿Estás seguro de que quieres eliminar este contenido?")) {
      setPersonalizedContent((prev) => ({
        ...prev,
        [contactId]: (prev[contactId] || []).filter((content) => content.id !== contentId),
      }))
    }
  }

  if (showIntro && !isConfigured) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100">
        <div className="container mx-auto p-4 max-w-lg">
          {/* Logo Header */}
          <div className="text-center mb-8 pt-8">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <PadlockHeartIcon className="w-8 h-8 text-rose-600" />
            </div>
            <h1 className="text-2xl font-bold text-rose-900">TimeCapsule</h1>
          </div>

          {/* Carousel */}
          <Card className="mb-6 border-rose-200 shadow-lg">
            <CardContent className="p-0">
              <div className="aspect-[3/2] mb-4 rounded-t-lg overflow-hidden bg-gray-100">
                <img
                  src={introSlides[currentSlide].image || "/placeholder.svg"}
                  alt={introSlides[currentSlide].title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-balance mb-3 text-rose-900">
                  {introSlides[currentSlide].title}
                </h2>
                <p className="text-rose-700 text-pretty leading-relaxed">{introSlides[currentSlide].description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center mb-6">
            <Button
              variant="outline"
              onClick={prevSlide}
              className="border-rose-200 text-rose-700 hover:bg-rose-50 bg-transparent"
            >
              Anterior
            </Button>

            <div className="flex space-x-2">
              {introSlides.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentSlide ? "bg-rose-500" : "bg-rose-200"
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              onClick={nextSlide}
              className="border-rose-200 text-rose-700 hover:bg-rose-50 bg-transparent"
            >
              Siguiente
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button onClick={skipIntro} className="w-full bg-rose-600 hover:bg-rose-700 text-white" size="lg">
              Comenzar mi TimeCapsule
            </Button>
            <Button variant="ghost" onClick={skipIntro} className="w-full text-rose-600 hover:bg-rose-50">
              Saltar introducción
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100">
        <div className="container mx-auto p-4 max-w-lg">
          <div className="text-center mb-8 pt-8">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <PadlockHeartIcon className="w-8 h-8 text-rose-600" />
            </div>
            <h1 className="text-2xl font-bold text-rose-900">TimeCapsule</h1>
          </div>

          <Card className="border-rose-200 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-rose-900">¿Cuándo quieres grabar tu primer video?</CardTitle>
              <CardDescription className="text-rose-700">
                Selecciona una fecha futura para recibir tu primer recordatorio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="reminder-date" className="text-rose-800">
                  Fecha del recordatorio
                </Label>
                <Input
                  id="reminder-date"
                  type="date"
                  value={reminderDate}
                  onChange={(e) => setReminderDate(e.target.value)}
                  min={getMinDate()}
                  className="border-rose-200 focus:border-rose-400"
                />
              </div>

              <div className="bg-rose-50 p-4 rounded-lg border border-rose-200">
                <h4 className="font-medium text-rose-800 mb-2">¿Cómo funciona?</h4>
                <ul className="text-sm text-rose-700 space-y-1">
                  <li>• Recibirás un recordatorio en la fecha seleccionada</li>
                  <li>• Tendrás hasta 2 semanas para grabar tu video</li>
                  <li>• Solo puedes grabar un video por año</li>
                  <li>• Cada video debe durar máximo 1 minuto</li>
                </ul>
              </div>

              <Button
                onClick={handleSaveReminderDate}
                disabled={!reminderDate}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white"
                size="lg"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Configurar Recordatorio
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (currentView === "dashboard") {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-4 max-w-2xl">
          {/* Logo Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <PadlockHeartIcon className="w-8 h-8 text-rose-600" />
            </div>
            <h1 className="text-3xl font-bold text-balance mb-2">TimeCapsule</h1>
            <p className="text-muted-foreground text-pretty">Tu legado digital para las futuras generaciones</p>
            <div className="flex items-center justify-center gap-4 mt-4">
              <p className="text-sm text-muted-foreground">Bienvenido, {user?.email}</p>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Cerrar Sesión
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* 1. Tu Video de Vida */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-sm sm:text-base leading-tight">Tu Video de Vida</CardTitle>
                <CardDescription className="text-xs sm:text-sm leading-relaxed">
                  Videos anuales de 1 minuto que documentan tu crecimiento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full text-xs sm:text-sm" onClick={() => setCurrentView("lifeVideo")}>
                  Ver Videos
                </Button>
              </CardContent>
            </Card>

            {/* 2. Información Personalizada */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-sm sm:text-base leading-tight">Información Personalizada</CardTitle>
                <CardDescription className="text-xs sm:text-sm leading-relaxed">
                  Videos, fotos y archivos específicos para cada persona
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full text-xs sm:text-sm" onClick={() => setCurrentView("personalizedInfo")}>
                  Gestionar Contenido
                </Button>
              </CardContent>
            </Card>

            {/* 3. Contactos */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-sm sm:text-base leading-tight">Contactos</CardTitle>
                <CardDescription className="text-xs sm:text-sm leading-relaxed">
                  Gestiona contactos y qué contenido recibirá cada uno
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full text-xs sm:text-sm" onClick={() => setCurrentView("contacts")}>
                  Configurar Contactos
                </Button>
              </CardContent>
            </Card>

            {/* 4. Sistema de Legado */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-sm sm:text-base leading-tight">Sistema de Legado</CardTitle>
                <CardDescription className="text-xs sm:text-sm leading-relaxed">
                  Contacto de confianza y configuración de envío
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full text-xs sm:text-sm" onClick={() => setCurrentView("legacy")}>
                  Configurar Sistema
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (currentView === "lifeVideo") {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-4 max-w-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <PadlockHeartIcon className="w-8 h-8 text-rose-600" />
            </div>
            <h1 className="text-2xl font-bold text-balance mb-2">Tu Video de Vida</h1>
            <p className="text-muted-foreground text-pretty">Gestiona tus videos anuales de crecimiento personal</p>
          </div>

          <div className="space-y-4">
            {/* 1.1 Video Completo de Vida */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">Video Completo de Vida</CardTitle>
                <CardDescription>
                  Visualiza la recopilación completa de todos tus videos anuales de 1 minuto
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => setCurrentView("completeLifeVideo")}>
                  Ver Video Completo
                </Button>
              </CardContent>
            </Card>

            {/* 1.2 Videos Independientes de Vida */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">Videos Independientes de Vida</CardTitle>
                <CardDescription>Visualiza y elimina cada uno de tus videos anuales por separado</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => setCurrentView("independentLifeVideos")}>
                  Gestionar Videos Individuales
                </Button>
              </CardContent>
            </Card>
          </div>

          <Button variant="outline" className="w-full mt-6 bg-transparent" onClick={() => setCurrentView("dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Inicio
          </Button>
        </div>
      </div>
    )
  }

  if (currentView === "completeLifeVideo") {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-4 max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-balance mb-2">Video Completo de Vida</h1>
            <p className="text-muted-foreground text-pretty">Tu historia completa año tras año</p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Recopilación Completa</CardTitle>
              <CardDescription>Todos tus videos anuales compilados en una sola experiencia</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-100 rounded-lg p-8 text-center">
                  <Video className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-4">
                    {recordedVideos.length > 0
                      ? `${recordedVideos.length} videos listos para compilar`
                      : "Aún no tienes videos grabados"}
                  </p>
                  <Button
                    disabled={recordedVideos.length === 0}
                    onClick={() => {
                      setPlayingVideo("compiled")
                    }}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Reproducir Video Completo
                  </Button>
                </div>

                {recordedVideos.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Videos incluidos:</h4>
                    {recordedVideos.map((video) => (
                      <div key={video.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Video className="w-5 h-5 text-primary" />
                          <div>
                            <p className="font-medium">{video.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {video.year} • {video.duration}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Button variant="outline" className="w-full mt-6 bg-transparent" onClick={() => setCurrentView("lifeVideo")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Videos de Vida
          </Button>
        </div>
      </div>
    )
  }

  if (currentView === "independentLifeVideos") {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-4 max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-balance mb-2">Videos Independientes</h1>
            <p className="text-muted-foreground text-pretty">Gestiona cada video anual por separado</p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Tus Videos Anuales</CardTitle>
              <CardDescription>Visualiza y elimina videos individuales según necesites</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recordedVideos.length > 0 ? (
                  recordedVideos.map((video) => (
                    <div key={video.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Video className="w-8 h-8 text-primary" />
                        <div>
                          <p className="font-medium">{video.title}</p>
                          <p className="text-sm text-muted-foreground">{video.duration}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handlePlayVideo(video.id)}>
                          <Play className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDeleteVideo(video.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Video className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">Aún no tienes videos grabados</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Button variant="outline" className="w-full mt-6 bg-transparent" onClick={() => setCurrentView("lifeVideo")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Videos de Vida
          </Button>
        </div>
      </div>
    )
  }

  if (currentView === "personalizedInfo") {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-4 max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-balance mb-2">Información Personalizada</h1>
            <p className="text-muted-foreground text-pretty">Gestiona contenido específico para cada contacto</p>
          </div>

          {familyContacts.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  No tienes contactos agregados aún. Ve a la sección de Contactos para agregar familiares.
                </p>
                <Button onClick={() => setCurrentView("contacts")}>Ir a Contactos</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {familyContacts.map((contact) => (
                <Card key={contact.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{contact.name}</span>
                      <span className="text-sm text-muted-foreground">{contact.relation}</span>
                    </CardTitle>
                    <CardDescription>{contact.email}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">Video Completo de Vida</p>
                          <p className="text-sm text-muted-foreground">Incluir todos los videos anuales en el envío</p>
                        </div>
                        <Button
                          variant={personalizedInfoSettings[contact.id]?.includeLifeVideo ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleVideoOption(contact.id)}
                        >
                          {personalizedInfoSettings[contact.id]?.includeLifeVideo ? "Activado" : "Desactivado"}
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewFiles(contact.id, contact.name)}>
                          <FileText className="w-4 h-4 mr-1" />
                          Ver Archivos
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleAddContent(contact.id)}>
                          <Plus className="w-4 h-4 mr-1" />
                          Agregar
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setShowFileManager(contact.id)}>
                          <Edit className="w-4 h-4 mr-1" />
                          Editar
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteContent(contact.id, "all")}>
                          <Trash2 className="w-4 h-4 mr-1" />
                          Eliminar
                        </Button>
                      </div>

                      <div className="text-sm text-muted-foreground">
                        <p>Archivos: {(personalizedContent[contact.id] || []).length} elementos</p>
                        <p>
                          Video personalizado:{" "}
                          {personalizedInfoSettings[contact.id]?.includeLifeVideo ? "Incluido" : "No incluido"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <Button onClick={() => setCurrentView("dashboard")} variant="outline" className="w-full mt-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Inicio
          </Button>

          {showFileManager && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <Card className="w-full max-w-md max-h-[80vh] overflow-y-auto">
                <CardHeader>
                  <CardTitle>Archivos de {familyContacts.find((c) => c.id === showFileManager)?.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(personalizedContent[showFileManager] || []).length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">No hay archivos agregados</p>
                    ) : (
                      (personalizedContent[showFileManager] || []).map((content) => (
                        <div key={content.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{content.title}</p>
                            <p className="text-sm text-muted-foreground">{content.fileName}</p>
                            <p className="text-xs text-muted-foreground">{content.dateAdded}</p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteContent(showFileManager, content.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button onClick={() => handleAddContent(showFileManager)} className="flex-1">
                      <Plus className="w-4 h-4 mr-1" />
                      Agregar Archivo
                    </Button>
                    <Button variant="outline" onClick={() => setShowFileManager(null)}>
                      Cerrar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {showAddContent && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle>Agregar Contenido</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Título</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md"
                        value={newContentForm.title}
                        onChange={(e) => setNewContentForm((prev) => ({ ...prev, title: e.target.value }))}
                        placeholder="Nombre del archivo o contenido"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Tipo</label>
                      <select
                        className="w-full p-2 border rounded-md"
                        value={newContentForm.type}
                        onChange={(e) => setNewContentForm((prev) => ({ ...prev, type: e.target.value }))}
                      >
                        <option value="document">Documento</option>
                        <option value="photo">Foto</option>
                        <option value="video">Video</option>
                        <option value="audio">Audio</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Archivo</label>
                      <input
                        type="file"
                        className="w-full p-2 border rounded-md"
                        onChange={(e) => setNewContentForm((prev) => ({ ...prev, file: e.target.files[0] }))}
                        accept={
                          newContentForm.type === "photo"
                            ? "image/*"
                            : newContentForm.type === "video"
                              ? "video/*"
                              : "*/*"
                        }
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-6">
                    <Button onClick={() => handleSaveContent(showAddContent)} className="flex-1">
                      Guardar
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddContent(null)}>
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (currentView === "contacts") {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-4 max-w-2xl">
          <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Contactos</h2>
            </div>

            {/* Family Contacts Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Contactos Familiares
                </CardTitle>
                <CardDescription>
                  Estas personas recibirán tu TimeCapsule completo y el código QR para la lápida
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {familyContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
                    >
                      {editingContact === contact.id ? (
                        <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                            className="w-full p-2 border rounded"
                            placeholder="Nombre"
                          />
                          <input
                            type="email"
                            value={editForm.email}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, email: e.target.value }))}
                            className="w-full p-2 border rounded"
                            placeholder="Email"
                          />
                          <input
                            type="text"
                            value={editForm.relation}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, relation: e.target.value }))}
                            className="w-full p-2 border rounded"
                            placeholder="Relación"
                          />
                          <input
                            type="text"
                            value={editForm.rut}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, rut: e.target.value }))}
                            className="w-full p-2 border rounded"
                            placeholder="RUT"
                          />
                        </div>
                      ) : (
                        <div>
                          <p className="font-medium">{contact.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {contact.email} • {contact.relation}
                          </p>
                          <p className="text-sm text-muted-foreground">RUT: {contact.rut}</p>
                        </div>
                      )}
                      <div className="flex space-x-2">
                        {editingContact === contact.id ? (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-green-600 hover:text-green-700"
                              onClick={handleSaveEdit}
                            >
                              Guardar
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-600 hover:text-gray-700"
                              onClick={() => setEditingContact(null)}
                            >
                              Cancelar
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-blue-600 hover:text-blue-700"
                              onClick={() => handleEditContact(contact)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteContact(contact.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contact-name">Nombre</Label>
                      <Input
                        id="contact-name"
                        placeholder="Nombre completo"
                        value={newContact.name}
                        onChange={(e) => setNewContact((prev) => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact-email">Email</Label>
                      <Input
                        id="contact-email"
                        type="email"
                        placeholder="email@ejemplo.com"
                        value={newContact.email}
                        onChange={(e) => setNewContact((prev) => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact-relation">Relación</Label>
                      <Input
                        id="contact-relation"
                        placeholder="Hijo, Esposa, etc."
                        value={newContact.relation}
                        onChange={(e) => setNewContact((prev) => ({ ...prev, relation: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact-rut">RUT</Label>
                      <Input
                        id="contact-rut"
                        placeholder="12.345.678-9"
                        value={newContact.rut}
                        onChange={(e) => setNewContact((prev) => ({ ...prev, rut: e.target.value }))}
                      />
                    </div>
                  </div>
                  <Button onClick={handleSaveContacts} className="w-full">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Agregar Contacto
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Button variant="outline" onClick={() => setCurrentView("dashboard")} className="w-full mt-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Inicio
          </Button>
        </div>
      </div>
    )
  }

  if (currentView === "legacy") {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-4 max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-balance mb-2">Sistema de Legado</h1>
            <p className="text-muted-foreground text-pretty">
              Configuración para el envío automático de tu TimeCapsule
            </p>
          </div>

          <div className="space-y-6">
            {/* Trusted Contact Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Contacto de Confianza
                </CardTitle>
                <CardDescription>
                  Esta persona puede activar manualmente el envío de tu TimeCapsule si es necesario
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-2">Responsabilidades del contacto de confianza:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Activar el envío del TimeCapsule cuando sea necesario</li>
                      <li>• Confirmar el fallecimiento del usuario</li>
                      <li>• Asegurar que el código QR llegue a los familiares</li>
                      <li>• Coordinar la colocación del QR en la lápida</li>
                    </ul>
                  </div>

                  <div>
                    <Label htmlFor="trusted-contact">Email del Contacto de Confianza</Label>
                    <Input
                      id="trusted-contact"
                      type="email"
                      value={trustedContact}
                      onChange={(e) => setTrustedContact(e.target.value)}
                      placeholder="Ingresa el email del contacto de confianza"
                    />
                  </div>
                  <Button onClick={handleSaveTrustedContact} className="w-full">
                    Guardar Contacto de Confianza
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Check-in System */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Sistema de Verificación
                </CardTitle>
                <CardDescription>Verificación anual automática para confirmar que estás bien</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-sm text-green-800">
                      <strong>Último check-in:</strong> {lastCheckIn} (Automático al ingresar)
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      El sistema registra automáticamente tu actividad al usar la app. Si no hay actividad por 365 días,
                      se notificará a tu contacto de confianza.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>Estado:</strong> Sistema activo y funcionando correctamente
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Próxima verificación automática:{" "}
                      {new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Legacy Content Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Contenido del TimeCapsule
                </CardTitle>
                <CardDescription>Vista previa de lo que se incluirá en el envío final</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="text-sm">Videos anuales compilados</span>
                    <span className="text-xs text-green-600">✓ Incluido</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="text-sm">Videos personalizados por contacto</span>
                    <span className="text-xs text-green-600">✓ Incluido</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="text-sm">Código QR para lápida</span>
                    <span className="text-xs text-green-600">✓ Incluido</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="text-sm">Información personalizada</span>
                    <span className="text-xs text-green-600">✓ Incluido</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Button variant="outline" className="w-full mt-6 bg-transparent" onClick={() => setCurrentView("dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Inicio
          </Button>
        </div>
      </div>
    )
  }

  if (playingVideo) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {playingVideo === "compiled" ? "Video Completo de Vida" : `Reproduciendo Video`}
            </h3>
            <Button variant="ghost" onClick={handleCloseVideo}>
              ×
            </Button>
          </div>
          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-4">
            {videoBlobs[playingVideo] || playingVideo === "compiled" ? (
              <video
                controls
                autoPlay
                className="w-full h-full rounded-lg"
                src={
                  playingVideo === "compiled"
                    ? Object.values(videoBlobs)[0] || recordedVideos.find((v) => v.blobUrl)?.blobUrl
                    : videoBlobs[playingVideo] || recordedVideos.find((v) => v.id === playingVideo)?.blobUrl
                }
              >
                Tu navegador no soporta la reproducción de video.
              </video>
            ) : (
              <div className="text-center">
                <Video className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">
                  {playingVideo === "compiled"
                    ? "Reproduciendo compilación completa de videos anuales"
                    : "Video no disponible"}
                </p>
              </div>
            )}
          </div>
          <Button onClick={handleCloseVideo} className="w-full">
            Cerrar
          </Button>
        </div>
      </div>
    )
  }

  return null
}
