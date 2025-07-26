import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '../contexts/AuthContext'
import { ArchaeologicalProvider } from '../contexts/ArchaeologicalContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Suite Arqueológica - Sistema de Gestión Arqueológica Integrada',
  description: 'Plataforma completa para la gestión de proyectos arqueológicos, incluyendo trabajo de campo, análisis de laboratorio, y documentación científica.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <ArchaeologicalProvider>
            {children}
          </ArchaeologicalProvider>
        </AuthProvider>
      </body>
    </html>
  )
} 