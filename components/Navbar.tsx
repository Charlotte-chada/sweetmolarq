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
    <nav className="flex items-center justify-between px-6 py-3 bg-white border-b border-cream-border sticky top-0 z-10">
      <Link href="/" className="font-display text-xl font-semibold text-coffee">
        SweetMolar<sup className="text-[10px] text-caramel font-body font-normal">Q</sup>
      </Link>
      <div className="flex gap-2">
        {LINKS.map(link => (
          <Link key={link.href} href={link.href}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              path === link.href
                ? 'bg-caramel-pale border-caramel-border text-coffee font-medium'
                : 'border-cream-border text-muted hover:border-caramel hover:text-coffee'
            }`}>
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
