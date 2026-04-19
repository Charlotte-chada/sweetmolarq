import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Noto_Sans_Thai } from 'next/font/google'
import './globals.css'

const notoSansThai = Noto_Sans_Thai({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-noto',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SweetMolarQ — เครื่องมือคำนวณที่ Cafe & Bakery ต้องการ',
  description:
    'คำนวณต้นทุน Recipe, วิเคราะห์ Menu Engineering Matrix และคำนวณ Break-Even สำหรับ cafe และ home baker — ใช้งานฟรี ไม่ต้องติดตั้ง',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="th" className={notoSansThai.variable}>
      <body
        className="font-body bg-bg text-ink antialiased"
        style={{ fontFamily: "'Noto Sans Thai', sans-serif" }}
      >
        {children}
      </body>
    </html>
  )
}
