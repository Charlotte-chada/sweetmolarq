import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-display',
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-body',
})

export const metadata: Metadata = {
  title: 'SweetMolarQ — Sweet Science of Bakery & Cafe',
  description: 'เครื่องมือคำนวณต้นทุน วิเคราะห์เมนู และวางแผนการเงิน สำหรับ cafe และ home baker',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="th" className={`${cormorant.variable} ${jakarta.variable}`}>
      <body className="font-body bg-white text-[#111827]">{children}</body>
    </html>
  )
}