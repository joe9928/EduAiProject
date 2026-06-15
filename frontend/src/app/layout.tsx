// src/app/layout.tsx
import type { Metadata } from 'next'
import { Syne, DM_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import AuthProvider from '@/providers/AuthProvider'
import GSAPProvider from '@/providers/GSAPProvider'
import { Toaster } from '@/components/ui/sonner'
import QueryProvider from '@/providers/QueryProvider'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600'],
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'EduLearn — AI-Powered Adaptive Learning',
    template: '%s | EduLearn',
  },
  description:
    'EduLearn combines adaptive AI with world-class content to create a personalised learning experience that evolves with you.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={` ${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable} `}
    >
      <body className="font-body antialiased" suppressHydrationWarning>
        <QueryProvider>
          <AuthProvider>
            <GSAPProvider>{children}</GSAPProvider>
          </AuthProvider>
        </QueryProvider>

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'oklch(var(--card))',
              border: '1px solid oklch(var(--border))',
              color: 'oklch(var(--foreground))',
            },
          }}
        />
      </body>
    </html>
  )
}
