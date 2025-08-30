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
      color: "linear-gradient(135deg, #ec4899 0%, #e11d48 100%)"
    },
    {
      title: "Tu Crecimiento a Través del Tiempo",
      description:
        "Imagina a tus hijos viendo tu evolución desde los 8 hasta los 53 años. Un minuto por año que cuenta la historia de tu vida y sabiduría.",
      icon: "⏰",
      color: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
    },
    {
      title: "Memorias que Inspiran",
      description:
        "Comparte momentos de alegría, lecciones aprendidas y palabras de amor. Deja un legado positivo que inspire a las futuras generaciones.",
      icon: "🌟",
      color: "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)"
    },
    {
      title: "Un Tesoro Familiar",
      description:
        "Tus videos se compilarán en un hermoso recuerdo que tus familiares atesorarán para siempre. Una ventana a tu corazón y tu historia.",
      icon: "💎",
      color: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)"
    },
    {
      title: "Tu Legado Digital",
      description:
        "Cuando llegue el momento, tus seres queridos recibirán este regalo especial. Un recordatorio eterno de tu amor y las lecciones que compartiste.",
      icon: "🕊️",
      color: "linear-gradient(135deg, #10b981 0%, #059669 100%)"
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
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #f3e8ff 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '28rem',
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '1rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: 'none',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ padding: '2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{
                margin: '0 auto 1.5rem',
                width: '6rem',
                height: '6rem',
                background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 25px -5px rgba(236, 72, 153, 0.4)'
              }}>
                <Heart style={{ width: '3rem', height: '3rem', color: 'white' }} />
              </div>
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: '#be185d',
                marginBottom: '0.75rem',
                margin: '0 0 0.75rem 0'
              }}>TimeCapsule</h1>
              <p style={{
                color: '#be185d',
                fontSize: '1.125rem',
                margin: 0
              }}>Tu legado digital para las futuras generaciones</p>
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{ marginBottom: '2rem' }}>
                <div style={{
                  width: '100%',
                  height: '12rem',
                  background: introSlides[currentSlide].color,
                  borderRadius: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{ fontSize: '4rem' }}>{introSlides[currentSlide].icon}</div>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <h2 style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    marginBottom: '1rem',
                    margin: '0 0 1rem 0'
                  }}>
                    {introSlides[currentSlide].title}
                  </h2>
                  <p style={{
                    color: '#6b7280',
                    fontSize: '1rem',
                    lineHeight: '1.6',
                    margin: 0
                  }}>
                    {introSlides[currentSlide].description}
                  </p>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '2rem'
                }}>
                  <button
                    onClick={prevSlide}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#be185d',
                      cursor: 'pointer',
                      borderRadius: '50%',
                      width: '2.5rem',
                      height: '2.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#fdf2f8'
                      e.currentTarget.style.color = '#be185d'
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = '#be185d'
                    }}
                  >
                    <ChevronLeft style={{ width: '1.25rem', height: '1.25rem' }} />
                  </button>

                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    {introSlides.map((_, index) => (
                      <div
                        key={index}
                        style={{
                          width: '0.75rem',
                          height: '0.75rem',
                          borderRadius: '50%',
                          transition: 'all 0.3s',
                          background: index === currentSlide ? '#ec4899' : '#e5e7eb',
                          transform: index === currentSlide ? 'scale(1.25)' : 'scale(1)'
                        }}
                      />
                    ))}
                  </div>

                  <button
                    onClick={nextSlide}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#be185d',
                      cursor: 'pointer',
                      borderRadius: '50%',
                      width: '2.5rem',
                      height: '2.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#fdf2f8'
                      e.currentTarget.style.color = '#be185d'
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = '#be185d'
                    }}
                  >
                    <ChevronRight style={{ width: '1.25rem', height: '1.25rem' }} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {currentSlide === introSlides.length - 1 ? (
                    <button
                      onClick={() => setShowIntro(false)}
                      style={{
                        width: '100%',
                        background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                        color: 'white',
                        fontSize: '1.125rem',
                        fontWeight: '600',
                        padding: '1rem',
                        borderRadius: '0.75rem',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 10px 25px -5px rgba(236, 72, 153, 0.4)',
                        transition: 'all 0.2s',
                        transform: 'scale(1)'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)'
                        e.currentTarget.style.background = 'linear-gradient(135deg, #db2777 0%, #be185d 100%)'
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'scale(1)'
                        e.currentTarget.style.background = 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)'
                      }}
                    >
                      Comenzar Mi TimeCapsule
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowIntro(false)}
                      style={{
                        width: '100%',
                        background: 'transparent',
                        border: '2px solid #fbcfe8',
                        color: '#be185d',
                        fontSize: '1.125rem',
                        fontWeight: '500',
                        padding: '1rem',
                        borderRadius: '0.75rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = '#fdf2f8'
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = 'transparent'
                      }}
                    >
                      Saltar Introducción
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === "welcome") {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #f3e8ff 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '28rem',
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '1rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: 'none',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{
              margin: '0 auto 1.5rem',
              width: '5rem',
              height: '5rem',
              background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 25px -5px rgba(236, 72, 153, 0.4)'
            }}>
              <Heart style={{ width: '2.5rem', height: '2.5rem', color: 'white' }} />
            </div>
            <h1 style={{
              fontSize: '1.875rem',
              fontWeight: 'bold',
              color: '#be185d',
              marginBottom: '0.75rem',
              margin: '0 0 0.75rem 0'
            }}>Bienvenido a TimeCapsule</h1>
            <p style={{
              color: '#be185d',
              fontSize: '1rem',
              lineHeight: '1.6',
              margin: '0 0 1.5rem 0'
            }}>
              Crea un legado hermoso que inspire a tus seres queridos por generaciones
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <label style={{
                  color: '#be185d',
                  fontWeight: '500',
                  fontSize: '0.875rem'
                }}>
                  ¿Cuándo quieres grabar tu primer video?
                </label>
                <input
                  type="date"
                  value={reminderDate}
                  onChange={(e) => setReminderDate(e.target.value)}
                  style={{
                    width: '100%',
                    border: '2px solid #fbcfe8',
                    borderRadius: '0.5rem',
                    padding: '0.75rem',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#ec4899'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#fbcfe8'
                  }}
                />
              </div>
              <button
                onClick={() => setCurrentStep("dashboard")}
                disabled={!reminderDate}
                style={{
                  width: '100%',
                  background: reminderDate ? 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)' : '#e5e7eb',
                  color: 'white',
                  fontWeight: '600',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: reminderDate ? 'pointer' : 'not-allowed',
                  boxShadow: reminderDate ? '0 10px 25px -5px rgba(236, 72, 153, 0.4)' : 'none',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  if (reminderDate) {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #db2777 0%, #be185d 100%)'
                  }
                }}
                onMouseOut={(e) => {
                  if (reminderDate) {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)'
                  }
                }}
              >
                <Calendar style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem', display: 'inline' }} />
                Configurar Recordatorio
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === "dashboard") {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #f3e8ff 100%)',
        padding: '1.5rem'
      }}>
        <div style={{
          maxWidth: '64rem',
          margin: '0 auto'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: '#be185d',
              marginBottom: '1rem',
              margin: '0 0 1rem 0'
            }}>Tu TimeCapsule Digital</h1>
            <p style={{
              color: '#be185d',
              fontSize: '1.125rem',
              lineHeight: '1.6',
              maxWidth: '32rem',
              margin: '0 auto'
            }}>
              Es hora de grabar tu video anual. Comparte momentos de alegría, lecciones aprendidas y palabras de amor
              que inspiren a tus seres queridos.
            </p>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
            border: '2px solid #fbcfe8',
            marginBottom: '2rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem'
            }}>
              <div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#be185d',
                  margin: '0 0 0.5rem 0'
                }}>Video Anual {getCurrentYear()}</h3>
                <p style={{
                  color: '#be185d',
                  margin: '0.5rem 0 0 0'
                }}>
                  {canRecordThisYear() ? "Comparte tu crecimiento y sabiduría" : "Ya grabaste tu video de este año"}
                </p>
              </div>
              <div style={{
                background: '#fdf2f8',
                color: '#be185d',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Clock style={{ width: '1rem', height: '1rem' }} />
                {canRecordThisYear() ? "Pendiente" : "Completado"}
              </div>
            </div>

            {canRecordThisYear() ? (
              !isRecording ? (
                <button
                  onClick={handleStartRecording}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                    color: 'white',
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 10px 25px -5px rgba(236, 72, 153, 0.4)',
                    transition: 'all 0.2s',
                    transform: 'scale(1)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)'
                    e.currentTarget.style.background = 'linear-gradient(135deg, #db2777 0%, #be185d 100%)'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'scale(1)'
                    e.currentTarget.style.background = 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)'
                  }}
                >
                  <Video style={{ width: '1.5rem', height: '1.5rem', marginRight: '0.75rem', display: 'inline' }} />
                  Comenzar Grabación (1 min)
                </button>
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                  <div style={{
                    width: '5rem',
                    height: '5rem',
                    background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    animation: 'pulse 2s infinite',
                    boxShadow: '0 10px 25px -5px rgba(236, 72, 153, 0.4)'
                  }}>
                    <Video style={{ width: '2.5rem', height: '2.5rem', color: 'white' }} />
                  </div>
                  <p style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: '#be185d',
                    margin: '0 0 0.5rem 0'
                  }}>Grabando...</p>
                  <p style={{
                    color: '#be185d',
                    margin: 0
                  }}>Comparte momentos hermosos y lecciones de vida</p>
                </div>
              )
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{
                  width: '5rem',
                  height: '5rem',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.4)'
                }}>
                  <CheckCircle style={{ width: '2.5rem', height: '2.5rem', color: 'white' }} />
                </div>
                <p style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#be185d',
                  margin: '0 0 0.5rem 0'
                }}>Video de {getCurrentYear()} Completado</p>
                <p style={{
                  color: '#be185d',
                  margin: '0 0 1.5rem 0'
                }}>
                  Solo puedes grabar un video por año para mantener la esencia de TimeCapsule
                </p>
                <div style={{
                  background: '#e0f2fe',
                  border: '2px solid #90cdf4',
                  borderRadius: '0.75rem',
                  padding: '1.5rem',
                  marginTop: '1.5rem'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem'
                  }}>
                    <AlertCircle style={{ width: '1.5rem', height: '1.5rem', color: '#3b82f6', marginTop: '0.25rem', flexShrink: 0 }} />
                    <div style={{ textAlign: 'left' }}>
                      <p style={{
                        fontSize: '1rem',
                        fontWeight: '600',
                        color: '#3b82f6',
                        marginBottom: '0.5rem'
                      }}>¿Por qué solo un video por año?</p>
                      <p style={{
                        color: '#6b7280',
                        lineHeight: '1.6'
                      }}>
                        Cada video representa un momento único en tu vida. Esta limitación hace que cada grabación
                        sea más significativa y mantiene el propósito original de crear una cápsula del tiempo
                        auténtica.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '1rem',
              padding: '1.5rem',
              textAlign: 'center',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
              border: 'none'
            }}>
              <div style={{
                width: '4rem',
                height: '4rem',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                boxShadow: '0 10px 25px -5px rgba(139, 92, 246, 0.4)'
              }}>
                <Users style={{ width: '2rem', height: '2rem', color: 'white' }} />
              </div>
              <h4 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#be185d',
                margin: '0 0 0.5rem 0'
              }}>Contactos</h4>
              <p style={{
                color: '#be185d',
                margin: 0
              }}>{familyContacts.length} familiares</p>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '1rem',
              padding: '1.5rem',
              textAlign: 'center',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
              border: 'none'
            }}>
              <div style={{
                width: '4rem',
                height: '4rem',
                background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                boxShadow: '0 10px 25px -5px rgba(236, 72, 153, 0.4)'
              }}>
                <Shield style={{ width: '2rem', height: '2rem', color: 'white' }} />
              </div>
              <h4 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#be185d',
                margin: '0 0 0.5rem 0'
              }}>Sistema de Legado</h4>
              <p style={{
                color: '#be185d',
                margin: 0
              }}>Configurado</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button
              onClick={() => setCurrentStep("library")}
              style={{
                width: '100%',
                background: 'transparent',
                border: '2px solid #fbcfe8',
                color: '#be185d',
                fontSize: '1.125rem',
                fontWeight: '500',
                padding: '1rem',
                borderRadius: '0.75rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#fdf2f8'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'transparent'
              }}
            >
              Ver Videos Anteriores
            </button>
            <button
              onClick={() => setCurrentStep("legacy")}
              style={{
                width: '100%',
                background: 'transparent',
                border: '2px solid #fbcfe8',
                color: '#be185d',
                fontSize: '1.125rem',
                fontWeight: '500',
                padding: '1rem',
                borderRadius: '0.75rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#fdf2f8'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'transparent'
              }}
            >
              <Shield style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem', display: 'inline' }} />
              Configurar Sistema de Legado
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === "legacy") {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #f3e8ff 100%)',
        padding: '1.5rem'
      }}>
        <div style={{
          maxWidth: '64rem',
          margin: '0 auto'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: '#be185d',
              marginBottom: '1rem',
              margin: '0 0 1rem 0'
            }}>Sistema de Legado Digital</h1>
            <p style={{
              color: '#be185d',
              fontSize: '1.125rem',
              lineHeight: '1.6',
              margin: '0 0 1.5rem 0'
            }}>
              Configura cómo y cuándo se enviará tu TimeCapsule a tus seres queridos
            </p>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
            border: '2px solid #fbcfe8',
            marginBottom: '2rem'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '1rem',
                padding: '1.5rem',
                border: '2px solid #fbcfe8'
              }}>
                <h4 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#be185d',
                  marginBottom: '0.75rem'
                }}>Contacto de Confianza</h4>
                <p style={{
                  color: '#be185d',
                  fontSize: '0.875rem',
                  lineHeight: '1.6',
                  marginBottom: '1.5rem'
                }}>
                  Esta persona podrá activar el envío manualmente
                </p>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem'
                }}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}>
                    <Label htmlFor="trusted-contact" style={{
                      color: '#be185d',
                      fontWeight: '500',
                      fontSize: '0.875rem'
                    }}>Email del contacto de confianza</Label>
                    <Input
                      id="trusted-contact"
                      type="email"
                      placeholder="contacto@email.com"
                      value={trustedContact}
                      onChange={(e) => setTrustedContact(e.target.value)}
                      style={{
                        border: '2px solid #fbcfe8',
                        borderRadius: '0.5rem',
                        padding: '0.75rem',
                        fontSize: '1rem',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#ec4899'
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#fbcfe8'
                      }}
                    />
                  </div>
                  <div style={{
                    background: 'white',
                    borderRadius: '0.75rem',
                    border: '2px solid #fbcfe8',
                    padding: '1.5rem'
                  }}>
                    <h4 style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#be185d',
                      marginBottom: '0.75rem'
                    }}>¿Cómo funciona?</h4>
                    <ul style={{
                      color: '#be185d',
                      fontSize: '0.875rem',
                      lineHeight: '1.6',
                      margin: 0,
                      padding: 0,
                      listStyle: 'none'
                    }}>
                      <li>• Tu contacto de confianza puede activar el envío manualmente</li>
                      <li>• Si no respondes al check-in anual, se le notificará automáticamente</li>
                      <li>• Solo esta persona puede autorizar el envío del TimeCapsule</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setCurrentStep("dashboard")}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                  color: 'white',
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  padding: '1rem',
                  borderRadius: '0.75rem',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 10px 25px -5px rgba(236, 72, 153, 0.4)',
                  transition: 'all 0.2s',
                  transform: 'scale(1)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)'
                  e.currentTarget.style.background = 'linear-gradient(135deg, #db2777 0%, #be185d 100%)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.background = 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)'
                }}
              >
                Volver al Inicio
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === "library") {
    if (viewingCompiled) {
      return (
        <div style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #f3e8ff 100%)',
          padding: '1.5rem'
        }}>
          <div style={{
            maxWidth: '64rem',
            margin: '0 auto'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: '#be185d',
                marginBottom: '1rem',
                margin: '0 0 1rem 0'
              }}>Video Compilado Final</h1>
              <p style={{
                color: '#be185d',
                fontSize: '1.125rem',
                lineHeight: '1.6',
                margin: '0 0 1.5rem 0'
              }}>
                Este es el video completo que se enviará a tus contactos
              </p>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '1rem',
              padding: '2rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
              border: 'none'
            }}>
              <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                <div style={{
                  width: '6rem',
                  height: '6rem',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.4)'
                }}>
                  <Play style={{ width: '3rem', height: '3rem', color: 'white' }} />
                </div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem'
                }}>TimeCapsule Completa</h3>
                <p style={{
                  color: '#be185d',
                  marginBottom: '1.5rem'
                }}>
                  {recordedVideos.length} videos • Duración total: {getTotalDuration()}
                </p>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  textAlign: 'left',
                  maxWidth: '20rem',
                  margin: '0 auto'
                }}>
                  {recordedVideos.map((video, index) => (
                    <div key={video.id} style={{
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}>
                      <span style={{
                        fontSize: '0.875rem',
                        color: '#4b5563'
                      }}>
                        {index + 1}. {video.title}
                      </span>
                      <span style={{
                        fontSize: '0.875rem',
                        color: '#4b5563'
                      }}>{video.duration}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button style={{
                width: '100%',
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                color: 'white',
                fontSize: '1.125rem',
                fontWeight: '600',
                padding: '1rem',
                borderRadius: '0.75rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.4)',
                transition: 'all 0.2s',
                transform: 'scale(1)'
              }}>
                <Play style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem', display: 'inline' }} />
                Reproducir Video Completo
              </button>
            </div>

            <button
              onClick={() => setViewingCompiled(false)}
              style={{
                width: '100%',
                background: 'transparent',
                border: '2px solid #fbcfe8',
                color: '#be185d',
                fontSize: '1.125rem',
                fontWeight: '500',
                padding: '1rem',
                borderRadius: '0.75rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#fdf2f8'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'transparent'
              }}
            >
              Volver a la Biblioteca
            </button>
          </div>
        </div>
      )
    }

    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #f3e8ff 100%)',
        padding: '1.5rem'
      }}>
        <div style={{
          maxWidth: '64rem',
          margin: '0 auto'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: '#be185d',
              marginBottom: '1rem',
              margin: '0 0 1rem 0'
            }}>Tu Biblioteca de Memorias</h1>
            <p style={{
              color: '#be185d',
              fontSize: '1.125rem',
              lineHeight: '1.6',
              margin: '0 0 1.5rem 0'
            }}>Todos tus videos anuales guardados para la posteridad</p>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
            border: '2px solid #fbcfe8',
            marginBottom: '2rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <div style={{
                  width: '4rem',
                  height: '4rem',
                  background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 10px 25px -5px rgba(236, 72, 153, 0.4)'
                }}>
                  <Video style={{ width: '2rem', height: '2rem', color: 'white' }} />
                </div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <h4 style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: '#be185d',
                    margin: '0 0 0.5rem 0'
                  }}>Video Compilado Final</h4>
                  <p style={{
                    color: '#be185d',
                    margin: 0
                  }}>
                    {recordedVideos.length} videos • {getTotalDuration()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingCompiled(true)}
                style={{
                  background: 'transparent',
                  border: '2px solid #fbcfe8',
                  color: '#be185d',
                  fontSize: '1.125rem',
                  fontWeight: '500',
                  padding: '0.75rem',
                  borderRadius: '0.75rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#fdf2f8'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                <Eye style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem', display: 'inline' }} />
                Ver
              </button>
            </div>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            {recordedVideos.map((video) => (
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '1rem',
                padding: '1.5rem',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                border: 'none'
              }} key={video.id}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}>
                    <div style={{
                      width: '4rem',
                      height: '4rem',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.4)'
                    }}>
                      <Play style={{ width: '2rem', height: '2rem', color: 'white' }} />
                    </div>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column'
                    }}>
                      <h4 style={{
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        color: '#be185d',
                        margin: '0 0 0.5rem 0'
                      }}>{video.title}</h4>
                      <p style={{
                        color: '#be185d',
                        margin: 0
                      }}>
                        Año {video.year} • {video.duration}
                      </p>
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    gap: '0.75rem'
                  }}>
                    <button style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#be185d',
                      cursor: 'pointer',
                      borderRadius: '0.75rem',
                      transition: 'all 0.2s'
                    }}>
                      <Play style={{ width: '1.25rem', height: '1.25rem' }} />
                    </button>
                    <button
                      onClick={() => handleDeleteVideo(video.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#dc2626',
                        cursor: 'pointer',
                        borderRadius: '0.75rem',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = '#fef3f2'
                        e.currentTarget.style.color = '#991b1b'
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.color = '#dc2626'
                      }}
                    >
                      <Trash2 style={{ width: '1.25rem', height: '1.25rem' }} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setCurrentStep("dashboard")}
            style={{
              width: '100%',
              background: 'transparent',
              border: '2px solid #fbcfe8',
              color: '#be185d',
              fontSize: '1.125rem',
              fontWeight: '500',
              padding: '1rem',
              borderRadius: '0.75rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#fdf2f8'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent'
            }}
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    )
  }

  return null
}
