"use client"

import { useState } from "react"
import { Heart } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

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
        background: '#fff5f7',
        borderRadius: '1rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid #fbcfe8'
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
            marginBottom: '0.75rem'
          }}>Bienvenido a TimeCapsule</h1>
          <p style={{
            color: '#374151',
            fontSize: '1rem',
            marginBottom: '1.5rem'
          }}>
            Ingresa tus credenciales para acceder a tu legado digital
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                padding: '0.75rem',
                fontSize: '1rem',
                backgroundColor: '#fff',
                outline: 'none'
              }}
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                pad
