// src/app/layout.tsx
import type { Metadata } from 'next'
import { Syne, DM_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import GSAPProvider from '@/providers/GSAPProvider'

const syne = Syne({
  subsets:  ['latin'],
  variable: '--font-display',
  weight:   ['400', '500', '600', '700', '800'],
  display:  'swap',
})

const dmSans = DM_Sans({
  subsets:  ['latin'],
  variable: '--font-body',
  weight:   ['300', '400', '500', '600'],
  display:  'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets:  ['latin'],
  variable: '--font-mono',
  weight:   ['400', '500'],
  display:  'swap',
})

export const metadata: Metadata = {
  title: {
    default:  'EduLearn — AI-Powered Adaptive Learning',
    template: '%s | EduLearn',
  },
  description:
    'EduLearn combines adaptive AI with world-class content to create a personalised learning experience that evolves with you.',
  keywords: ['e-learning', 'AI education', 'adaptive learning', 'online courses'],
  openGraph: {
    title:       'EduLearn — AI-Powered Adaptive Learning',
    description: 'Personalised learning that evolves with you.',
    type:        'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`
        ${syne.variable}
        ${dmSans.variable}
        ${jetbrainsMono.variable}
      `}
    >
      <body
        className="font-body antialiased"
        suppressHydrationWarning
      >
        <GSAPProvider>
          <Navbar />
          {children}
          <Footer />
        </GSAPProvider>
      </body>
    </html>
  )
}