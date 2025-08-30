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
      icon: "💝",
      color: "from-pink-500 to-rose-500"
    },
    {
      title: "Tu Crecimiento a Través del Tiempo",
      description:
        "Imagina a tus hijos viendo tu evolución desde los 8 hasta los 53 años. Un minuto por año que cuenta la historia de tu vida y sabiduría.",
      icon: "⏰",
      color: "from-blue-500 to-indigo-500"
    },
    {
      title: "Memorias que Inspiran",
      description:
        "Comparte momentos de alegría, lecciones aprendidas y palabras de amor. Deja un legado positivo que inspire a las futuras generaciones.",
      icon: "🌟",
      color: "from-yellow-500 to-orange-500"
    },
    {
      title: "Un Tesoro Familiar",
      description:
        "Tus videos se compilarán en un hermoso recuerdo que tus familiares atesorarán para siempre. Una ventana a tu corazón y tu historia.",
      icon: "💎",
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Tu Legado Digital",
      description:
        "Cuando llegue el momento, tus seres queridos recibirán este regalo especial. Un recordatorio eterno de tu amor y las lecciones que compartiste.",
      icon: "🕊️",
      color: "from-green-500 to-teal-500"
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
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="mx-auto mb-6 w-24 h-24 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                <Heart className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-rose-900 mb-3">TimeCapsule</h1>
              <p className="text-rose-700 text-lg">Tu legado digital para las futuras generaciones</p>
            </div>

            <div className="relative">
              <div className="mb-8">
                <div className={`w-full h-48 bg-gradient-to-br ${introSlides[currentSlide].color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                  <div className="text-6xl">{introSlides[currentSlide].icon}</div>
                </div>

                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 text-balance">
                    {introSlides[currentSlide].title}
                  </h2>
                  <p className="text-gray-600 text-base leading-relaxed text-pretty">
                    {introSlides[currentSlide].description}
                  </p>
                </div>

                <div className="flex items-center justify-between mb-8">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={prevSlide}
                    className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-full w-10 h-10 p-0"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>

                  <div className="flex space-x-3">
                    {introSlides.map((_, index) => (
                      <div
                        key={index}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentSlide 
                            ? "bg-rose-500 scale-125" 
                            : "bg-rose-200 hover:bg-rose-300"
                        }`}
                      />
                    ))}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={nextSlide}
                    className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-full w-10 h-10 p-0"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>

                <div className="space-y-4">
                  {currentSlide === introSlides.length - 1 ? (
                    <Button 
                      onClick={() => setShowIntro(false)}
                      className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-lg font-semibold py-4 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105"
                      size="lg"
                    >
                      Comenzar Mi TimeCapsule
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => setShowIntro(false)}
                      className="w-full border-2 border-rose-200 text-rose-700 hover:bg-rose-50 text-lg font-medium py-4 rounded-xl transition-all duration-200"
                    >
                      Saltar Introducción
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (currentStep === "welcome") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-rose-900 mb-3">Bienvenido a TimeCapsule</CardTitle>
            <CardDescription className="text-rose-700 text-base leading-relaxed">
              Crea un legado hermoso que inspire a tus seres queridos por generaciones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="reminder-date" className="text-rose-800 font-medium">¿Cuándo quieres grabar tu primer video?</Label>
              <Input
                id="reminder-date"
                type="date"
                value={reminderDate}
                onChange={(e) => setReminderDate(e.target.value)}
                className="w-full border-2 border-rose-200 focus:border-rose-500 rounded-lg py-3"
              />
            </div>
            <Button 
              onClick={() => setCurrentStep("dashboard")} 
              className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold py-3 rounded-lg shadow-lg" 
              disabled={!reminderDate}
            >
              <Calendar className="w-5 h-5 mr-2" />
              Configurar Recordatorio
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (currentStep === "dashboard") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
        <div className="container mx-auto p-6 max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-rose-900 mb-4">Tu TimeCapsule Digital</h1>
            <p className="text-rose-700 text-lg leading-relaxed max-w-2xl mx-auto">
              Es hora de grabar tu video anual. Comparte momentos de alegría, lecciones aprendidas y palabras de amor
              que inspiren a tus seres queridos.
            </p>
          </div>

          <div className="grid gap-6 mb-8">
            <Card className={`${canRecordThisYear() ? "border-2 border-rose-200 bg-gradient-to-r from-rose-50 to-pink-50" : "border-2 border-gray-200 bg-gray-50"} shadow-lg`}>
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-rose-900">Video Anual {getCurrentYear()}</h3>
                    <p className="text-rose-700 mt-2">
                      {canRecordThisYear() ? "Comparte tu crecimiento y sabiduría" : "Ya grabaste tu video de este año"}
                    </p>
                  </div>
                  <Badge variant={canRecordThisYear() ? "secondary" : "outline"} className="text-sm font-medium px-4 py-2 bg-rose-100 text-rose-800">
                    <Clock className="w-4 h-4 mr-2" />
                    {canRecordThisYear() ? "Pendiente" : "Completado"}
                  </Badge>
                </div>

                {canRecordThisYear() ? (
                  !isRecording ? (
                    <Button 
                      onClick={handleStartRecording} 
                      className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-lg font-semibold py-4 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105" 
                      size="lg"
                    >
                      <Video className="w-6 h-6 mr-3" />
                      Comenzar Grabación (1 min)
                    </Button>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse shadow-lg">
                        <Video className="w-10 h-10 text-white" />
                      </div>
                      <p className="text-xl font-semibold text-rose-900 mb-2">Grabando...</p>
                      <p className="text-rose-700">Comparte momentos hermosos y lecciones de vida</p>
                    </div>
                  )
                ) : (
                  <div className="text-center py-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <CheckCircle className="w-10 h-10 text-white" />
                    </div>
                    <p className="text-xl font-semibold text-rose-900 mb-2">Video de {getCurrentYear()} Completado</p>
                    <p className="text-rose-700 mb-6">
                      Solo puedes grabar un video por año para mantener la esencia de TimeCapsule
                    </p>
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                      <div className="flex items-start space-x-4">
                        <AlertCircle className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                        <div className="text-left">
                          <p className="text-lg font-semibold text-blue-900 mb-2">¿Por qué solo un video por año?</p>
                          <p className="text-blue-800 leading-relaxed">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold text-rose-900 mb-2">Contactos</h4>
                  <p className="text-rose-700">{familyContacts.length} familiares</p>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold text-rose-900 mb-2">Sistema de Legado</h4>
                  <p className="text-rose-700">Configurado</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-4">
            <Button 
              variant="outline" 
              onClick={() => setCurrentStep("library")} 
              className="w-full border-2 border-rose-200 text-rose-700 hover:bg-rose-50 text-lg font-medium py-4 rounded-xl transition-all duration-200"
            >
              Ver Videos Anteriores
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setCurrentStep("legacy")} 
              className="w-full border-2 border-rose-200 text-rose-700 hover:bg-rose-50 text-lg font-medium py-4 rounded-xl transition-all duration-200"
            >
              <Shield className="w-5 h-5 mr-2" />
              Configurar Sistema de Legado
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === "legacy") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
        <div className="container mx-auto p-6 max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-rose-900 mb-4">Sistema de Legado Digital</h1>
            <p className="text-rose-700 text-lg leading-relaxed">
              Configura cómo y cuándo se enviará tu TimeCapsule a tus seres queridos
            </p>
          </div>

          <div className="space-y-6">
            <Card className="border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-amber-800 text-2xl">
                  <Shield className="w-6 h-6 mr-3" />
                  Contacto de Confianza
                </CardTitle>
                <CardDescription className="text-amber-700 text-base">
                  Esta persona podrá activar el envío manualmente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="trusted-contact" className="text-amber-800 font-semibold">Email del contacto de confianza</Label>
                    <Input
                      id="trusted-contact"
                      type="email"
                      placeholder="contacto@email.com"
                      value={trustedContact}
                      onChange={(e) => setTrustedContact(e.target.value)}
                      className="mt-2 border-2 border-amber-200 focus:border-amber-500 rounded-lg"
                    />
                  </div>
                  <div className="bg-white p-6 rounded-xl border-2 border-amber-200">
                    <h4 className="font-semibold text-amber-800 mb-3 text-lg">¿Cómo funciona?</h4>
                    <ul className="text-amber-700 space-y-2">
                      <li>• Tu contacto de confianza puede activar el envío manualmente</li>
                      <li>• Si no respondes al check-in anual, se le notificará automáticamente</li>
                      <li>• Solo esta persona puede autorizar el envío del TimeCapsule</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button 
              variant="outline" 
              onClick={() => setCurrentStep("dashboard")} 
              className="w-full border-2 border-rose-200 text-rose-700 hover:bg-rose-50 text-lg font-medium py-4 rounded-xl transition-all duration-200 mt-8"
            >
              Volver al Inicio
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === "library") {
    if (viewingCompiled) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
          <div className="container mx-auto p-6 max-w-4xl">
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold text-rose-900 mb-4">Video Compilado Final</h1>
              <p className="text-rose-700 text-lg leading-relaxed">
                Este es el video completo que se enviará a tus contactos
              </p>
            </div>

            <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Play className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">TimeCapsule Completa</h3>
                  <p className="text-rose-700 mb-4">
                    {recordedVideos.length} videos • Duración total: {getTotalDuration()}
                  </p>
                  <div className="space-y-2 text-sm text-gray-600 text-left max-w-sm mx-auto">
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

            <Button variant="outline" onClick={() => setViewingCompiled(false)} className="w-full border-2 border-rose-200 text-rose-700 hover:bg-rose-50 text-lg font-medium py-4 rounded-xl transition-all duration-200">
              Volver a la Biblioteca
            </Button>
          </div>
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
        <div className="container mx-auto p-6 max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-rose-900 mb-4">Tu Biblioteca de Memorias</h1>
            <p className="text-rose-700 text-lg leading-relaxed">Todos tus videos anuales guardados para la posteridad</p>
          </div>

          <Card className="mb-8 border-2 border-rose-200 bg-gradient-to-r from-rose-50 to-pink-50 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Video className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-rose-900">Video Compilado Final</h4>
                    <p className="text-rose-700">
                      {recordedVideos.length} videos • {getTotalDuration()}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={() => setViewingCompiled(true)}
                  className="border-2 border-rose-300 text-rose-700 hover:bg-rose-50 rounded-lg"
                >
                  <Eye className="w-5 h-5 mr-2" />
                  Ver
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4 mb-8">
            {recordedVideos.map((video) => (
              <Card key={video.id} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Play className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold text-rose-900">{video.title}</h4>
                        <p className="text-rose-700">
                          Año {video.year} • {video.duration}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <Button variant="ghost" size="lg" className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg">
                        <Play className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="lg"
                        onClick={() => handleDeleteVideo(video.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button 
            variant="outline" 
            onClick={() => setCurrentStep("dashboard")} 
            className="w-full border-2 border-rose-200 text-rose-700 hover:bg-rose-50 text-lg font-medium py-4 rounded-xl transition-all duration-200"
          >
            Volver al Inicio
          </Button>
        </div>
      </div>
    )
  }

  return null
}
