"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  Video,
  Heart,
  Users,
  QrCode,
  Mail,
  Clock,
  Play,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Shield,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

export default function LegacyVideoApp() {
  const [showIntro, setShowIntro] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [currentStep, setCurrentStep] = useState("welcome")
  const [reminderDate, setReminderDate] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [recordedVideos, setRecordedVideos] = useState([
    { id: 1, year: 2023, title: "Mi reflexión de 2023", duration: "0:58" },
    { id: 2, year: 2024, title: "Pensamientos de 2024", duration: "1:00" },
  ])
  const [viewingCompiled, setViewingCompiled] = useState(false)
  const [trustedContact, setTrustedContact] = useState("")
  const [familyContacts, setFamilyContacts] = useState([
    { id: 1, name: "María González", email: "maria@email.com", relation: "Hija" },
    { id: 2, name: "Carlos González", email: "carlos@email.com", relation: "Hijo" },
    { id: 3, name: "Ana López", email: "ana@email.com", relation: "Esposa" },
  ])
  const [lastCheckIn, setLastCheckIn] = useState("15 de Enero, 2025")

  const introSlides = [
    {
      title: "Un Regalo Para Tus Seres Queridos",
      description:
        "Crea una cápsula del tiempo digital que perdurará para siempre. Cada año, dedica un minuto a compartir tus pensamientos, experiencias y amor.",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-EHpdxWsvTwc6tv25ayfyZ2e2Ij5F9E.png",
    },
    {
      title: "Tu Crecimiento a Través del Tiempo",
      description:
        "Imagina a tus hijos viendo tu evolución desde los 8 hasta los 53 años. Un minuto por año que cuenta la historia de tu vida y sabiduría.",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2-pLtyTLGv0NlQjOK3KwmKTI6Tmmypkk.png",
    },
    {
      title: "Memorias que Inspiran",
      description:
        "Comparte momentos de alegría, lecciones aprendidas y palabras de amor. Deja un legado positivo que inspire a las futuras generaciones.",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%2029%20ago%202025%2C%2008_42_35%20p.m.-JfPLBdDkKSfIzqcyU6e7E0eGGMwdx1.png",
    },
    {
      title: "Un Tesoro Familiar",
      description:
        "Tus videos se compilarán en un hermoso recuerdo que tus familiares atesorarán para siempre. Una ventana a tu corazón y tu historia.",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%2029%20ago%202025%2C%2008_46_42%20p.m.-8nEBJCuaaZ3BZ2v8SlDDTLMuXYNxbm.png",
    },
    {
      title: "Tu Legado Digital",
      description:
        "Cuando llegue el momento, tus seres queridos recibirán este regalo especial. Un recordatorio eterno de tu amor y las lecciones que compartiste.",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%2029%20ago%202025%2C%2008_53_36%20p.m.-pIAP8nAyGlQCxB4MYuDCpE5Ie6pVPD.png",
    },
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % introSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + introSlides.length) % introSlides.length)
  }

  const canRecordThisYear = () => {
    const currentYear = new Date().getFullYear()
    return !recordedVideos.some((video) => video.year === currentYear)
  }

  const getCurrentYear = () => new Date().getFullYear()

  const handleStartRecording = () => {
    if (!canRecordThisYear()) {
      return
    }

    setIsRecording(true)
    setTimeout(() => {
      setIsRecording(false)
      setRecordedVideos([
        ...recordedVideos,
        {
          id: Date.now(),
          year: getCurrentYear(),
          title: `Mi video de ${getCurrentYear()}`,
          duration: "0:45",
        },
      ])
      setCurrentStep("library")
    }, 3000)
  }

  const handleDeleteVideo = (videoId: number) => {
    setRecordedVideos(recordedVideos.filter((video) => video.id !== videoId))
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

  if (showIntro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <div className="mx-auto mb-4 w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center">
                <Heart className="w-10 h-10 text-rose-600" />
              </div>
              <h1 className="text-3xl font-bold text-rose-900 mb-2">TimeCapsule</h1>
              <p className="text-rose-700 text-sm">Tu legado digital para las futuras generaciones</p>
            </div>

            <div className="relative">
              <div className="aspect-[3/2] mb-4 rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={introSlides[currentSlide].image || "/placeholder.svg"}
                  alt={introSlides[currentSlide].title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3 text-balance">
                  {introSlides[currentSlide].title}
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed text-pretty">
                  {introSlides[currentSlide].description}
                </p>
              </div>

              <div className="flex items-center justify-between mb-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={prevSlide}
                  className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <div className="flex space-x-2">
                  {introSlides.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentSlide ? "bg-rose-600" : "bg-rose-200"
                      }`}
                    />
                  ))}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={nextSlide}
                  className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-3">
                {currentSlide === introSlides.length - 1 ? (
                  <Button
                    onClick={() => setShowIntro(false)}
                    className="w-full bg-rose-600 hover:bg-rose-700 text-white"
                    size="lg"
                  >
                    Comenzar Mi TimeCapsule
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setShowIntro(false)}
                    className="w-full border-rose-200 text-rose-700 hover:bg-rose-50"
                  >
                    Saltar Introducción
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (currentStep === "welcome") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl text-balance">Bienvenido a TimeCapsule</CardTitle>
            <CardDescription className="text-pretty">
              Crea un legado hermoso que inspire a tus seres queridos por generaciones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reminder-date">¿Cuándo quieres grabar tu primer video?</Label>
              <Input
                id="reminder-date"
                type="date"
                value={reminderDate}
                onChange={(e) => setReminderDate(e.target.value)}
                className="w-full"
              />
            </div>
            <Button onClick={() => setCurrentStep("dashboard")} className="w-full" disabled={!reminderDate}>
              <Calendar className="w-4 h-4 mr-2" />
              Configurar Recordatorio
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (currentStep === "dashboard") {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-4 max-w-2xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-balance mb-2">Tu TimeCapsule Digital</h1>
            <p className="text-muted-foreground text-pretty">
              Es hora de grabar tu video anual. Comparte momentos de alegría, lecciones aprendidas y palabras de amor
              que inspiren a tus seres queridos.
            </p>
          </div>

          <div className="grid gap-4 mb-6">
            <Card className={`${canRecordThisYear() ? "border-primary/20" : "border-gray-200 bg-gray-50"}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">Video Anual {getCurrentYear()}</h3>
                    <p className="text-sm text-muted-foreground">
                      {canRecordThisYear() ? "Comparte tu crecimiento y sabiduría" : "Ya grabaste tu video de este año"}
                    </p>
                  </div>
                  <Badge variant={canRecordThisYear() ? "secondary" : "outline"}>
                    <Clock className="w-3 h-3 mr-1" />
                    {canRecordThisYear() ? "Pendiente" : "Completado"}
                  </Badge>
                </div>

                {canRecordThisYear() ? (
                  !isRecording ? (
                    <Button onClick={handleStartRecording} className="w-full" size="lg">
                      <Video className="w-5 h-5 mr-2" />
                      Comenzar Grabación (1 min)
                    </Button>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <Video className="w-8 h-8 text-primary" />
                      </div>
                      <p className="font-medium">Grabando...</p>
                      <p className="text-sm text-muted-foreground">Comparte momentos hermosos y lecciones de vida</p>
                    </div>
                  )
                ) : (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="font-medium text-gray-700">Video de {getCurrentYear()} Completado</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Solo puedes grabar un video por año para mantener la esencia de TimeCapsule
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="text-left">
                          <p className="text-sm font-medium text-blue-800">¿Por qué solo un video por año?</p>
                          <p className="text-sm text-blue-700 mt-1">
                            Cada video representa un momento único en tu vida. Esta limitación hace que cada grabación
                            sea más significativa y mantiene el propósito original de crear una cápsula del tiempo
                            auténtica.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="w-8 h-8 text-accent mx-auto mb-2" />
                  <h4 className="font-medium">Contactos</h4>
                  <p className="text-sm text-muted-foreground">{familyContacts.length} familiares</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Shield className="w-8 h-8 text-accent mx-auto mb-2" />
                  <h4 className="font-medium">Sistema de Legado</h4>
                  <p className="text-sm text-muted-foreground">Configurado</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-4">
            <Button variant="outline" onClick={() => setCurrentStep("library")} className="w-full">
              Ver Videos Anteriores
            </Button>
            <Button variant="outline" onClick={() => setCurrentStep("legacy")} className="w-full">
              <Shield className="w-4 h-4 mr-2" />
              Configurar Sistema de Legado
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === "legacy") {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-4 max-w-2xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-balance mb-2">Sistema de Legado Digital</h1>
            <p className="text-muted-foreground text-pretty">
              Configura cómo y cuándo se enviará tu TimeCapsule a tus seres queridos
            </p>
          </div>

          <div className="space-y-6">
            {/* Trusted Contact Section */}
            <Card className="border-amber-200 bg-amber-50">
              <CardHeader>
                <CardTitle className="flex items-center text-amber-800">
                  <Shield className="w-5 h-5 mr-2" />
                  Contacto de Confianza
                </CardTitle>
                <CardDescription className="text-amber-700">
                  Esta persona podrá activar el envío manualmente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="trusted-contact">Email del contacto de confianza</Label>
                    <Input
                      id="trusted-contact"
                      type="email"
                      placeholder="contacto@email.com"
                      value={trustedContact}
                      onChange={(e) => setTrustedContact(e.target.value)}
                    />
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-amber-200">
                    <h4 className="font-medium text-amber-800 mb-2">¿Cómo funciona?</h4>
                    <ul className="text-sm text-amber-700 space-y-1">
                      <li>• Tu contacto de confianza puede activar el envío manualmente</li>
                      <li>• Si no respondes al check-in anual, se le notificará automáticamente</li>
                      <li>• Solo esta persona puede autorizar el envío del TimeCapsule</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Check-in System */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                  Sistema de Verificación
                </CardTitle>
                <CardDescription>Verificación anual para confirmar que estás bien</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                    <div>
                      <p className="font-medium text-green-800">Último check-in</p>
                      <p className="text-sm text-green-600">{lastCheckIn}</p>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Activo
                    </Badge>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">¿Cómo funciona el check-in?</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Cada año recibirás un recordatorio para confirmar que estás bien</li>
                      <li>• Si no respondes en 30 días, se notifica a tu contacto de confianza</li>
                      <li>• Tu contacto puede entonces decidir si activar el envío del TimeCapsule</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Family Contacts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Contactos Familiares
                </CardTitle>
                <CardDescription>Estas personas recibirán tu TimeCapsule y el código QR para la lápida</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {familyContacts.map((contact) => (
                    <div key={contact.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{contact.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {contact.email} • {contact.relation}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full bg-transparent">
                    <Users className="w-4 h-4 mr-2" />
                    Agregar Contacto
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* QR Code Info */}
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-800">
                  <QrCode className="w-5 h-5 mr-2" />
                  Código QR para Lápida
                </CardTitle>
                <CardDescription className="text-blue-700">
                  Se enviará automáticamente a tus contactos junto con el video
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-white p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-2">¿Qué incluye el envío?</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Video compilado completo con todos tus años</li>
                    <li>• Código QR para colocar en la lápida</li>
                    <li>• Instrucciones para acceder al video desde el QR</li>
                    <li>• Mensaje personalizado de despedida</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          <Button variant="outline" onClick={() => setCurrentStep("dashboard")} className="w-full mt-6">
            Volver al Inicio
          </Button>
        </div>
      </div>
    )
  }

  if (currentStep === "library") {
    if (viewingCompiled) {
      return (
        <div className="min-h-screen bg-background">
          <div className="container mx-auto p-4 max-w-2xl">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-balance mb-2">Video Compilado Final</h1>
              <p className="text-muted-foreground text-pretty">
                Este es el video completo que se enviará a tus contactos
              </p>
            </div>

            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="w-12 h-12 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">TimeCapsule Completa</h3>
                  <p className="text-muted-foreground mb-4">
                    {recordedVideos.length} videos • Duración total: {getTotalDuration()}
                  </p>
                  <div className="space-y-2 text-sm text-muted-foreground text-left max-w-sm mx-auto">
                    {recordedVideos.map((video, index) => (
                      <div key={video.id} className="flex justify-between">
                        <span>
                          {index + 1}. {video.title}
                        </span>
                        <span>{video.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <Button className="w-full" size="lg">
                  <Play className="w-5 h-5 mr-2" />
                  Reproducir Video Completo
                </Button>
              </CardContent>
            </Card>

            <Button variant="outline" onClick={() => setViewingCompiled(false)} className="w-full">
              Volver a la Biblioteca
            </Button>
          </div>
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-4 max-w-2xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-balance mb-2">Tu Biblioteca de Memorias</h1>
            <p className="text-muted-foreground text-pretty">Todos tus videos anuales guardados para la posteridad</p>
          </div>

          <Card className="mb-6 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Video className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Video Compilado Final</h4>
                    <p className="text-sm text-muted-foreground">
                      {recordedVideos.length} videos • {getTotalDuration()}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setViewingCompiled(true)}>
                  <Eye className="w-4 h-4 mr-1" />
                  Ver
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4 mb-6">
            {recordedVideos.map((video) => (
              <Card key={video.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Play className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{video.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          Año {video.year} • {video.duration}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Play className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteVideo(video.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-4">
            <Card className="border-dashed">
              <CardContent className="p-6 text-center">
                <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h4 className="font-medium mb-2">Configuración de Legado</h4>
                <p className="text-sm text-muted-foreground mb-4 text-pretty">
                  Estos videos se enviarán automáticamente a tus seres queridos cuando llegue el momento
                </p>
                <Button variant="outline" size="sm">
                  Configurar Contactos
                </Button>
              </CardContent>
            </Card>
          </div>

          <Button variant="outline" onClick={() => setCurrentStep("dashboard")} className="w-full mt-6">
            Volver al Inicio
          </Button>
        </div>
      </div>
    )
  }

  return null
}
