"use client"

import { Users, Video, FileText, ArrowLeft, Play, Trash2, Edit, Plus, Camera, StopCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  const [showCalendar, setShowCalendar] = useState(false)
  const [setupComplete, setSetupComplete] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [currentView, setCurrentView] = useState("loading")
  const [reminderDate, setReminderDate] = useState("")
  const [familyContacts, setFamilyContacts] = useState([])
  const [newContact, setNewContact] = useState({ name: "", email: "", relation: "", rut: "" })
  const [editingContact, setEditingContact] = useState(null)
  const [trustedContact, setTrustedContact] = useState({ email: "", name: "", saved: false })
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
  const [lifeVideos, setLifeVideos] = useState([])
  const [savedVideos, setSavedVideos] = useState([])
  const [compiledVideoUrl, setCompiledVideoUrl] = useState(null)
  const [editingFile, setEditingFile] = useState(null)
  const [viewingFile, setViewingFile] = useState(null)

  const router = useRouter()
  const supabase = createClient()
  const videoRef = useRef(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    const checkAuth = async () => {
      console.log("[v0] Checking authentication...")
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        console.log("[v0] No session found, redirecting to login")
        router.push("/auth/login")
        return
      }

      console.log("[v0] Session found, checking user setup...")
      setUser(session.user)

      const { data: profile } = await supabase
        .from("profiles")
        .select("annual_reminder_date")
        .eq("id", session.user.id)
        .single()

      if (profile?.annual_reminder_date) {
        console.log("[v0] User has setup but showing intro first")
        setSetupComplete(true)
        setShowIntro(true)
        setShowCalendar(false)
        setCurrentView("intro")
      } else {
        console.log("[v0] New user, starting with introduction")
        setSetupComplete(false)
        setShowIntro(true)
        setShowCalendar(false)
        setCurrentView("intro")
      }

      setLoading(false)
    }

    checkAuth()
  }, [router, supabase])

  const carouselImages = [
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-EHpdxWsvTwc6tv25ayfyZ2e2Ij5F9E.png",
      title: "Conexiones que Perduran",
      description: "TimeCapsule te permite crear un legado digital único para tus seres queridos.",
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2-pLtyTLGv0NlQjOK3KwmKTI6Tmmypkk.png",
      title: "Memorias que Inspiran",
      description: "Cada año, graba un video especial que capture tu crecimiento y sabiduría.",
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%2029%20ago%202025%2C%2008_42_35%20p.m.-JfPLBdDkKSfIzqcyU6e7E0eGGMwdx1.png",
      title: "Momentos Preciosos",
      description: "Documenta tu evolución personal y los momentos más significativos de tu vida.",
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%2029%20ago%202025%2C%2008_46_42%20p.m.-8nEBJCuaaZ3BZ2v8SlDDTLMuXYNxbm.png",
      title: "Legado Eterno",
      description: "Tu familia podrá acceder a tus recuerdos a través de un código QR especial.",
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%2029%20ago%202025%2C%2008_53_36%20p.m.-pIAP8nAyGlQCxB4MYuDCpE5Ie6pVPD.png",
      title: "Conexión Infinita",
      description: "Mantén viva la conexión con tus seres queridos para las futuras generaciones.",
    },
  ]

  const nextSlide = () => {
    if (currentSlide < carouselImages.length - 1) {
      setCurrentSlide(currentSlide + 1)
    } else {
      console.log("[v0] Introduction completed, showing calendar")
      if (setupComplete) {
        setShowIntro(false)
        setShowCalendar(false)
        setCurrentView("dashboard")
      } else {
        setShowIntro(false)
        setShowCalendar(true)
        setCurrentView("calendar")
      }
    }
  }

  const skipIntro = () => {
    console.log("[v0] Introduction skipped")
    if (setupComplete) {
      setShowIntro(false)
      setShowCalendar(false)
      setCurrentView("dashboard")
    } else {
      setShowIntro(false)
      setShowCalendar(true)
      setCurrentView("calendar")
    }
  }

  const getMinDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split("T")[0]
  }

  const configureReminder = async () => {
    if (!reminderDate || !user) return

    try {
      console.log("[v0] Saving reminder date:", reminderDate)
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        annual_reminder_date: reminderDate,
        updated_at: new Date().toISOString(),
      })

      if (error) {
        console.error("Error saving reminder date:", error)
        return
      }

      console.log("[v0] Reminder date saved successfully, going to dashboard")
      setShowCalendar(false)
      setShowIntro(false)
      setSetupComplete(true)
      setCurrentView("dashboard")
    } catch (error) {
      console.error("Error configuring reminder:", error)
    }
  }

  const handleAddContact = () => {
    if (!newContact.name || !newContact.email || !newContact.rut || !newContact.relation) return

    const contact = {
      id: Date.now(),
      ...newContact,
    }

    setFamilyContacts([...familyContacts, contact])
    setNewContact({ name: "", email: "", relation: "", rut: "" })
  }

  const handleEditContact = (contact) => {
    setEditingContact(contact)
    setNewContact(contact)
  }

  const handleUpdateContact = () => {
    if (!editingContact) return

    setFamilyContacts(
      familyContacts.map((contact) =>
        contact.id === editingContact.id ? { ...editingContact, ...newContact } : contact,
      ),
    )
    setEditingContact(null)
    setNewContact({ name: "", email: "", relation: "", rut: "" })
  }

  const handleDeleteContact = (contactId) => {
    setFamilyContacts(familyContacts.filter((contact) => contact.id !== contactId))
  }

  const handleViewFiles = (contact) => {
    setSelectedContact(contact)
    setViewingFile({ contact, files: personalizedFiles[contact.id] || [] })
  }

  const handleAddFile = (contact) => {
    setSelectedContact(contact)
    setNewFile({ title: "", type: "text", content: "", file: null })
    setEditingFile(null)
    setShowFileModal(true)
  }

  const handleEditFile = (contact, file) => {
    setSelectedContact(contact)
    setNewFile(file)
    setEditingFile(file)
    setShowFileModal(true)
  }

  const handleDeleteFile = (contactId, fileId) => {
    const updatedFiles = personalizedFiles[contactId]?.filter((file) => file.id !== fileId) || []
    setPersonalizedFiles({
      ...personalizedFiles,
      [contactId]: updatedFiles,
    })
  }

  const saveFile = () => {
    if (!selectedContact || !newFile.title) return

    const file = {
      id: editingFile?.id || Date.now(),
      title: newFile.title,
      type: newFile.type,
      content: newFile.content,
      file: newFile.file,
      createdAt: editingFile?.createdAt || new Date().toISOString(),
    }

    const contactFiles = personalizedFiles[selectedContact.id] || []
    const updatedFiles = editingFile
      ? contactFiles.map((f) => (f.id === editingFile.id ? file : f))
      : [...contactFiles, file]

    setPersonalizedFiles({
      ...personalizedFiles,
      [selectedContact.id]: updatedFiles,
    })

    setShowFileModal(false)
    setNewFile({ title: "", type: "text", content: "", file: null })
    setEditingFile(null)
  }

  const playVideo = (videoUrl) => {
    console.log("[v0] Playing video:", videoUrl)
    if (!videoUrl) {
      console.error("[v0] No video URL provided")
      alert("Video no disponible")
      return
    }

    let finalVideoUrl = null

    if (typeof videoUrl === "string" && videoUrl.startsWith("blob:")) {
      finalVideoUrl = videoUrl
    } else if (videoUrl instanceof Blob) {
      finalVideoUrl = URL.createObjectURL(videoUrl)
    } else if (typeof videoUrl === "string" && videoUrl.startsWith("http")) {
      finalVideoUrl = videoUrl
    } else {
      console.error("[v0] Invalid video URL format:", videoUrl)
      alert("Formato de video no válido")
      return
    }

    console.log("[v0] Final video URL for playback:", finalVideoUrl)
    setPlayingVideo(finalVideoUrl)
  }

  const playCompiledVideo = () => {
    console.log("[v0] Playing compiled video...")
    console.log("[v0] Saved videos:", savedVideos)
    console.log("[v0] Video blobs:", videoBlobs)

    if (savedVideos.length > 0) {
      const firstVideo = savedVideos[0]
      const videoUrl = firstVideo.url || videoBlobs[firstVideo.id]
      console.log("[v0] First video URL:", videoUrl)

      if (videoUrl) {
        playVideo(videoUrl)
      } else {
        alert("Video no disponible para reproducir")
      }
    } else {
      alert("No hay videos grabados para compilar")
    }
  }

  const deleteVideo = (videoId) => {
    console.log("[v0] Deleting video:", videoId)
    setSavedVideos((prev) => prev.filter((video) => video.id !== videoId))
    setVideoBlobs((prev) => {
      const newBlobs = { ...prev }
      if (newBlobs[videoId]) {
        URL.revokeObjectURL(newBlobs[videoId])
        delete newBlobs[videoId]
      }
      return newBlobs
    })
  }

  const handleCloseVideo = () => {
    setPlayingVideo(null)
  }

  const saveTrustedContact = () => {
    if (!trustedContact.name || !trustedContact.email) return
    setTrustedContact({ ...trustedContact, saved: true })
  }

  const startRecording = async () => {
    try {
      console.log("[v0] Starting video recording...")
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })

      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }

      let mimeType = "video/webm"
      if (MediaRecorder.isTypeSupported("video/webm;codecs=vp9")) {
        mimeType = "video/webm;codecs=vp9"
      } else if (MediaRecorder.isTypeSupported("video/webm;codecs=vp8")) {
        mimeType = "video/webm;codecs=vp8"
      } else if (MediaRecorder.isTypeSupported("video/mp4")) {
        mimeType = "video/mp4"
      }

      console.log("[v0] Using MIME type:", mimeType)

      const recorder = new MediaRecorder(mediaStream, { mimeType })
      const chunks = []
      const startTime = Date.now()

      recorder.ondataavailable = (event) => {
        console.log("[v0] Recording data available:", event.data.size)
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }

      recorder.onstop = () => {
        console.log("[v0] Recording stopped, processing...")
        const endTime = Date.now()
        const actualDuration = Math.floor((endTime - startTime) / 1000)
        const durationText = `${Math.floor(actualDuration / 60)}:${(actualDuration % 60).toString().padStart(2, "0")}`

        const blob = new Blob(chunks, { type: mimeType })
        const videoUrl = URL.createObjectURL(blob)

        console.log("[v0] Created video URL:", videoUrl)
        console.log("[v0] Blob size:", blob.size, "bytes")
        console.log("[v0] Blob type:", blob.type)

        const newVideo = {
          id: Date.now(),
          year: new Date().getFullYear(),
          duration: durationText,
          recorded: true,
          url: videoUrl,
          blob: blob,
          mimeType: mimeType,
        }

        console.log("[v0] Video saved with duration:", durationText)
        setSavedVideos((prev) => [...prev, newVideo])
        setVideoBlobs((prev) => ({ ...prev, [newVideo.id]: videoUrl }))
        setRecordedVideo(videoUrl)
        setIsRecording(false)
        setRecordingTime(0)

        // Clean up stream
        mediaStream.getTracks().forEach((track) => track.stop())
        setStream(null)
      }

      recorder.start(100) // Record in 100ms chunks for better data capture
      setMediaRecorder(recorder)
      setIsRecording(true)

      // Timer for recording duration
      const timer = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)

      // Auto-stop after 60 seconds
      setTimeout(() => {
        if (recorder.state === "recording") {
          recorder.stop()
          clearInterval(timer)
        }
      }, 60000)

      recorder.timer = timer
    } catch (error) {
      console.error("[v0] Error starting recording:", error)
      alert("Error al acceder a la cámara: " + error.message)
    }
  }

  const stopRecording = () => {
    console.log("[v0] Stopping recording manually...")
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop()
      if (mediaRecorder.timer) {
        clearInterval(mediaRecorder.timer)
      }
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    setRecordingTime(0)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <PadlockHeartIcon className="w-10 h-10 text-rose-600" />
          </div>
          <p className="text-lg text-muted-foreground">Cargando TimeCapsule...</p>
        </div>
      </div>
    )
  }

  if (showIntro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardContent className="p-6">
            <div className="aspect-[3/2] mb-4 rounded-lg overflow-hidden bg-gray-100">
              <img
                src={carouselImages[currentSlide].src || "/placeholder.svg"}
                alt={carouselImages[currentSlide].title}
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-2xl font-bold text-center mb-2 text-balance">{carouselImages[currentSlide].title}</h2>
            <p className="text-muted-foreground text-center mb-6 text-pretty">
              {carouselImages[currentSlide].description}
            </p>
            <div className="flex justify-center mb-6">
              {carouselImages.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full mx-1 ${index === currentSlide ? "bg-rose-600" : "bg-gray-300"}`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={skipIntro} className="flex-1 bg-transparent">
                Saltar
              </Button>
              <Button onClick={nextSlide} className="flex-1">
                Siguiente
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (showCalendar && !setupComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <PadlockHeartIcon className="w-10 h-10 text-rose-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">¡Bienvenido a TimeCapsule!</h2>
            <p className="text-muted-foreground mb-6">
              Configura tu primer recordatorio para comenzar tu legado digital
            </p>
            <div className="mb-6">
              <Label htmlFor="reminderDate" className="text-left block mb-2">
                ¿Cuándo quieres grabar tu primer video?
              </Label>
              <Input
                id="reminderDate"
                type="date"
                value={reminderDate}
                onChange={(e) => setReminderDate(e.target.value)}
                min={getMinDate()}
                className="w-full"
              />
            </div>
            <Button onClick={configureReminder} className="w-full" disabled={!reminderDate}>
              Configurar Recordatorio
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (currentView === "dashboard") {
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

            <Card
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setCurrentView("contacts")}
            >
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

  if (currentView === "videos") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="w-6 h-6" />
                Tu Video de Vida
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Video Completo de Vida</CardTitle>
                  <CardDescription>Tu compilación completa de videos anuales</CardDescription>
                </CardHeader>
                <CardContent>
                  {savedVideos.length === 0 ? (
                    <div className="text-center py-8">
                      <Video className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-muted-foreground">No hay videos grabados aún</p>
                      <p className="text-sm text-muted-foreground">Graba tu primer video para ver la compilación</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Video Compilado Final</h4>
                          <p className="text-sm text-muted-foreground">
                            {savedVideos.length} video{savedVideos.length !== 1 ? "s" : ""} • Duración total estimada:{" "}
                            {savedVideos.length}:00
                          </p>
                        </div>
                        <Button onClick={playCompiledVideo} disabled={savedVideos.length === 0}>
                          <Play className="w-4 h-4 mr-2" />
                          Reproducir Video Completo
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Videos Independientes de Vida</CardTitle>
                  <CardDescription>Gestiona tus videos anuales individuales</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {savedVideos.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No hay videos grabados</p>
                    </div>
                  ) : (
                    savedVideos.map((video) => (
                      <div key={video.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Video {video.year}</h4>
                          <p className="text-sm text-muted-foreground">Duración: {video.duration}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const videoUrl = video.url || videoBlobs[video.id]
                              console.log("[v0] Video object:", video)
                              console.log("[v0] Attempting to play video URL:", videoUrl)
                              console.log("[v0] Available video blobs:", Object.keys(videoBlobs))
                              if (videoUrl) {
                                playVideo(videoUrl)
                              } else {
                                alert("Video no disponible")
                              }
                            }}
                          >
                            <Play className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => deleteVideo(video.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    {!isRecording && !stream ? (
                      <div>
                        <Camera className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-lg font-medium mb-2">Grabar Nuevo Video</h3>
                        <p className="text-muted-foreground mb-4">Graba tu video anual de hasta 1 minuto</p>
                        <Button onClick={startRecording}>
                          <Camera className="w-4 h-4 mr-2" />
                          Comenzar Grabación
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <video ref={videoRef} autoPlay muted className="w-full max-w-md mx-auto mb-4 rounded-lg" />
                        <div className="flex items-center justify-center gap-4">
                          <span className="text-lg font-mono">
                            {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, "0")}
                          </span>
                          <Button onClick={stopRecording} variant="destructive">
                            <StopCircle className="w-4 h-4 mr-2" />
                            Detener Grabación
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Button onClick={() => setCurrentView("dashboard")} className="w-full mt-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al Inicio
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (currentView === "contacts") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-6 h-6" />
                Contactos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {editingContact ? "Editar Contacto" : "Agregar Nuevo Contacto"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nombre</Label>
                      <Input
                        id="name"
                        value={newContact.name}
                        onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                        placeholder="Nombre completo"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newContact.email}
                        onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                        placeholder="correo@ejemplo.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="rut">RUT</Label>
                      <Input
                        id="rut"
                        value={newContact.rut}
                        onChange={(e) => setNewContact({ ...newContact, rut: e.target.value })}
                        placeholder="12.345.678-9"
                      />
                    </div>
                    <div>
                      <Label htmlFor="relation">Relación</Label>
                      <Select
                        value={newContact.relation}
                        onValueChange={(value) => setNewContact({ ...newContact, relation: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar relación" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="padre">Padre</SelectItem>
                          <SelectItem value="madre">Madre</SelectItem>
                          <SelectItem value="hermano">Hermano/a</SelectItem>
                          <SelectItem value="hijo">Hijo/a</SelectItem>
                          <SelectItem value="esposo">Esposo/a</SelectItem>
                          <SelectItem value="amigo">Amigo/a</SelectItem>
                          <SelectItem value="otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button onClick={editingContact ? handleUpdateContact : handleAddContact} className="w-full">
                    {editingContact ? "Actualizar Contacto" : "Agregar Contacto"}
                  </Button>
                  {editingContact && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingContact(null)
                        setNewContact({ name: "", email: "", relation: "", rut: "" })
                      }}
                      className="w-full"
                    >
                      Cancelar
                    </Button>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contactos Familiares</CardTitle>
                </CardHeader>
                <CardContent>
                  {familyContacts.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No hay contactos agregados. Agrega tu primer contacto familiar.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {familyContacts.map((contact) => (
                        <div key={contact.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">{contact.name}</h4>
                            <p className="text-sm text-muted-foreground">{contact.email}</p>
                            <p className="text-sm text-muted-foreground">RUT: {contact.rut}</p>
                            <p className="text-sm text-muted-foreground capitalize">{contact.relation}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleEditContact(contact)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleDeleteContact(contact.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Button onClick={() => setCurrentView("dashboard")} className="w-full mt-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al Inicio
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (currentView === "personalized") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-6 h-6" />
                Información Personalizada
              </CardTitle>
            </CardHeader>
            <CardContent>
              {familyContacts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    Primero agrega contactos en la sección "Contactos" para poder gestionar información personalizada.
                  </p>
                  <Button onClick={() => setCurrentView("contacts")}>Ir a Contactos</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {familyContacts.map((contact) => (
                    <Card key={contact.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{contact.name}</CardTitle>
                        <CardDescription>
                          {contact.relation} - {personalizedFiles[contact.id]?.length || 0} archivos
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2 flex-wrap">
                          <Button size="sm" variant="outline" onClick={() => handleViewFiles(contact)}>
                            Ver Archivos
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleAddFile(contact)}>
                            <Plus className="w-4 h-4 mr-1" />
                            Agregar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const files = personalizedFiles[contact.id]
                              if (files && files.length > 0) {
                                handleEditFile(contact, files[0])
                              }
                            }}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              if (personalizedFiles[contact.id]?.length > 0) {
                                const fileToDelete = personalizedFiles[contact.id][0]
                                handleDeleteFile(contact.id, fileToDelete.id)
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Eliminar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              <Button onClick={() => setCurrentView("dashboard")} className="w-full mt-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al Inicio
              </Button>
            </CardContent>
          </Card>
        </div>

        {showFileModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{editingFile ? "Editar Archivo" : "Agregar Archivo"}</h3>
                <Button variant="outline" size="sm" onClick={() => setShowFileModal(false)}>
                  ×
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="fileTitle">Título</Label>
                  <Input
                    id="fileTitle"
                    value={newFile.title}
                    onChange={(e) => setNewFile({ ...newFile, title: e.target.value })}
                    placeholder="Título del archivo"
                  />
                </div>

                <div>
                  <Label htmlFor="fileType">Tipo</Label>
                  <Select value={newFile.type} onValueChange={(value) => setNewFile({ ...newFile, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Texto</SelectItem>
                      <SelectItem value="image">Imagen</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="audio">Audio</SelectItem>
                      <SelectItem value="document">Documento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="fileUpload">Archivo</Label>
                  <Input
                    id="fileUpload"
                    type="file"
                    ref={fileInputRef}
                    accept={
                      newFile.type === "image"
                        ? "image/*"
                        : newFile.type === "video"
                          ? "video/*"
                          : newFile.type === "audio"
                            ? "audio/*"
                            : newFile.type === "document"
                              ? ".pdf,.doc,.docx"
                              : "*"
                    }
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        setNewFile({ ...newFile, file })
                      }
                    }}
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={saveFile} className="flex-1">
                    {editingFile ? "Actualizar" : "Guardar"}
                  </Button>
                  <Button variant="outline" onClick={() => setShowFileModal(false)} className="flex-1">
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {viewingFile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Archivos de {viewingFile.contact.name}</h3>
                <Button variant="outline" size="sm" onClick={() => setViewingFile(null)}>
                  ×
                </Button>
              </div>

              {viewingFile.files?.length > 0 ? (
                <div className="space-y-4">
                  {viewingFile.files.map((file) => (
                    <div key={file.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{file.title}</h4>
                        <span className="text-xs text-muted-foreground capitalize">{file.type}</span>
                      </div>

                      {file.type === "image" && file.file && (
                        <img
                          src={URL.createObjectURL(file.file) || "/placeholder.svg"}
                          alt={file.title}
                          className="max-w-full h-auto rounded"
                        />
                      )}

                      {file.type === "video" && file.file && (
                        <video src={URL.createObjectURL(file.file)} controls className="max-w-full h-auto rounded" />
                      )}

                      {file.content && <p className="text-sm text-muted-foreground mt-2">{file.content}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No hay archivos para este contacto</p>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  if (currentView === "legacy") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PadlockHeartIcon className="w-6 h-6" />
                Sistema de Legado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contacto de Confianza</CardTitle>
                  <CardDescription>Persona responsable de activar el envío de tu TimeCapsule</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {trustedContact.saved ? (
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-800">Contacto de Confianza Guardado</h4>
                      <p className="text-sm text-green-600">Nombre: {trustedContact.name}</p>
                      <p className="text-sm text-green-600">Email: {trustedContact.email}</p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2 bg-transparent"
                        onClick={() => setTrustedContact({ ...trustedContact, saved: false })}
                      >
                        Editar
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div>
                        <Label htmlFor="trustedName">Nombre</Label>
                        <Input
                          id="trustedName"
                          value={trustedContact.name}
                          onChange={(e) => setTrustedContact({ ...trustedContact, name: e.target.value })}
                          placeholder="Nombre del contacto de confianza"
                        />
                      </div>
                      <div>
                        <Label htmlFor="trustedEmail">Email</Label>
                        <Input
                          id="trustedEmail"
                          type="email"
                          value={trustedContact.email}
                          onChange={(e) => setTrustedContact({ ...trustedContact, email: e.target.value })}
                          placeholder="correo@ejemplo.com"
                        />
                      </div>
                      <Button className="w-full" onClick={saveTrustedContact}>
                        Guardar Contacto de Confianza
                      </Button>
                    </>
                  )}

                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium mb-2">Responsabilidades del contacto de confianza:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Activar el envío del TimeCapsule cuando sea necesario</li>
                      <li>• Verificar tu estado anualmente mediante check-in</li>
                      <li>• Coordinar la entrega del legado digital a los familiares</li>
                      <li>• Gestionar el código QR para la lápida si es solicitado</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Sistema de Verificación</CardTitle>
                  <CardDescription>Verificación automática de estado cada año</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-green-800">Estado: Activo</h4>
                        <p className="text-sm text-green-600">Último check-in: Hoy</p>
                      </div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contenido del TimeCapsule</CardTitle>
                  <CardDescription>Resumen de lo que se incluirá en tu legado digital</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Videos anuales</span>
                      <span className="text-muted-foreground">{lifeVideos.length} videos</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Contactos familiares</span>
                      <span className="text-muted-foreground">{familyContacts.length} contactos</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Información personalizada</span>
                      <span className="text-muted-foreground">
                        {Object.values(personalizedFiles).reduce((acc, files) => acc + (files?.length || 0), 0)}{" "}
                        archivos
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Código QR para lápida</span>
                      <span className="text-muted-foreground">Incluido</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button onClick={() => setCurrentView("dashboard")} className="w-full mt-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al Inicio
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }
  playingVideo && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Reproducir Video</h3>
          <Button variant="ghost" size="sm" onClick={handleCloseVideo}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <video
          key={playingVideo} // Force re-render when URL changes
          src={playingVideo}
          controls
          className="w-full rounded"
          autoPlay
          preload="metadata"
          onError={(e) => {
            console.error("[v0] Video playback error:", e)
            console.error("[v0] Video URL:", playingVideo)
            console.error("[v0] Video element error:", e.target.error)
            const errorMessage = e.target.error?.message || "Archivo corrupto o formato no soportado"
            alert(`Error al reproducir el video: ${errorMessage}`)
          }}
          onLoadStart={() => console.log("[v0] Video loading started")}
          onLoadedMetadata={(e) => {
            console.log("[v0] Video metadata loaded")
            console.log("[v0] Video duration:", e.target.duration)
            console.log("[v0] Video dimensions:", e.target.videoWidth, "x", e.target.videoHeight)
            e.target.load()
          }}
          onCanPlay={() => {
            console.log("[v0] Video can play")
          }}
          onPlay={() => console.log("[v0] Video started playing")}
          onPause={() => console.log("[v0] Video paused")}
          onEnded={() => console.log("[v0] Video ended")}
        />
      </div>
    </div>
  )
}
