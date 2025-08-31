import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "TimeCapsule - Tu Legado Digital",
  description: "Crea una cápsula del tiempo digital con videos anuales. Preserva tus memorias, sabiduría y amor para las futuras generaciones. Una aplicación única para crear tu legado digital.",
  keywords: ["legado digital", "cápsula del tiempo", "videos anuales", "memorias familiares", "legado familiar", "videos para el futuro"],
  authors: [{ name: "TimeCapsule Team" }],
  creator: "TimeCapsule",
  publisher: "TimeCapsule",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://timecapsule-app.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "TimeCapsule - Tu Legado Digital",
    description: "Crea una cápsula del tiempo digital con videos anuales. Preserva tus memorias para las futuras generaciones.",
    url: 'https://timecapsule-app.vercel.app',
    siteName: 'TimeCapsule',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'TimeCapsule - Tu Legado Digital',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "TimeCapsule - Tu Legado Digital",
    description: "Crea una cápsula del tiempo digital con videos anuales. Preserva tus memorias para las futuras generaciones.",
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#dc2626" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
