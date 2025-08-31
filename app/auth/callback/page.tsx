"use client"

import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      const supabase = createClient()

      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Error during auth callback:", error)
          router.push("/auth/login?error=verification_failed")
          return
        }

        if (data.session) {
          // User is verified and logged in
          router.push("/")
        } else {
          // No session, redirect to login
          router.push("/auth/login")
        }
      } catch (error) {
        console.error("Unexpected error:", error)
        router.push("/auth/login?error=unexpected_error")
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100">
          <svg className="h-6 w-6 text-rose-600 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
        <h2 className="text-xl font-semibold">Verificando tu cuenta...</h2>
        <p className="text-gray-600 mt-2">Por favor espera mientras confirmamos tu email.</p>
      </div>
    </div>
  )
}
