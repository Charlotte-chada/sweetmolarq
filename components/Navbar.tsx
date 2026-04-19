'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

const LINKS = [
  { href: '/calculator', label: '🧮 ต้นทุน' },
  { href: '/menu',       label: '📊 เมนู' },
  { href: '/breakeven',  label: '💰 Break-even' },
]

export default function Navbar() {
  const path = usePathname()
  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm">
      <Link href="/" className="text-lg font-extrabold text-ink tracking-tight">
        SweetMolar<span className="grad-text">Q</span>
      </Link>
      <div className="flex gap-1.5">
        {LINKS.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors font-medium ${
              path === link.href
                ? 'border-orange-200 bg-orange-50 text-accent-dk'
                : 'border-gray-200 text-gray-500 hover:border-accent hover:text-accent-dk'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
