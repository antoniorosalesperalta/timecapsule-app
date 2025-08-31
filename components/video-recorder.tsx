"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Video, Square, Play, Pause } from "lucide-react"

interface VideoRecorderProps {
  onRecordingComplete: (videoBlob: Blob) => void
  maxDuration?: number // in seconds
}

export function VideoRecorder({ onRecordingComplete, maxDuration = 60 }: VideoRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const startRecording = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })

      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }

      const mediaRecorder = new MediaRecorder(mediaStream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" })
        onRecordingComplete(blob)
        mediaStream.getTracks().forEach((track) => track.stop())
        setStream(null)
      }

      mediaRecorder.start()
      setIsRecording(true)

      // Auto-stop after max duration
      setTimeout(() => {
        if (mediaRecorderRef.current && isRecording) {
          stopRecording()
        }
      }, maxDuration * 1000)
    } catch (error) {
      console.error("Error accessing camera:", error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsPaused(false)
      setRecordingTime(0)
    }
  }

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume()
        setIsPaused(false)
      } else {
        mediaRecorderRef.current.pause()
        setIsPaused(true)
      }
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="aspect-video bg-muted rounded-lg mb-4 overflow-hidden">
          <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />
        </div>

        <div className="flex items-center justify-center space-x-4">
          {!isRecording ? (
            <Button onClick={startRecording} size="lg" className="rounded-full">
              <Video className="w-5 h-5 mr-2" />
              Iniciar Grabación
            </Button>
          ) : (
            <>
              <Button onClick={pauseRecording} variant="outline" size="lg" className="rounded-full bg-transparent">
                {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
              </Button>
              <Button onClick={stopRecording} variant="destructive" size="lg" className="rounded-full">
                <Square className="w-5 h-5" />
              </Button>
            </>
          )}
        </div>

        {isRecording && (
          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground">Tiempo restante: {maxDuration - recordingTime}s</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
