"use client"

import { useState } from 'react'
import Navbar from '@/components/Navbar'

type MenuItem = {
  id: number
  name: string
  cost: number
  price: number
  sold: number
}

type Category = 'Star' | 'Plow Horse' | 'Puzzle' | 'Dog'

function classify(margin: number, avgMargin: number, sold: number, avgSold: number): Category {
  const highMargin = margin >= avgMargin
  const highSold   = sold   >= avgSold
  if (highMargin && highSold)   return 'Star'
  if (!highMargin && highSold)  return 'Plow Horse'
  if (highMargin && !highSold)  return 'Puzzle'
  return 'Dog'
}

const CAT_STYLE: Record<Category, { bg: string; text: string; border: string; emoji: string; tip: string }> = {
  'Star':       { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', emoji: '⭐', tip: 'ขายดี กำไรดี — promote ให้มากขึ้น' },
  'Plow Horse': { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200',   emoji: '🐴', tip: 'ขายดี แต่กำไรน้อย — ลองขึ้นราคาหรือลดต้นทุน' },
  'Puzzle':     { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', emoji: '🧩', tip: 'กำไรดี แต่ขายน้อย — ลอง promote หรือ reposition' },
  'Dog':        { bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-200',    emoji: '🐶', tip: 'ขายน้อย กำไรน้อย — พิจารณาตัดออกหรือปรับใหม่' },
}

const DEFAULT: MenuItem[] = [
  { id: 1, name: '☕ ลาเต้',          cost: 22, price: 85,  sold: 80 },
  { id: 2, name: '🥐 ครัวซองต์',      cost: 18, price: 55,  sold: 45 },
  { id: 3, name: '🎂 เค้กช็อกโกแลต', cost: 35, price: 120, sold: 20 },
  { id: 4, name: '🍪 คุกกี้',         cost: 8,  price: 35,  sold: 60 },
  { id: 5, name: '🧁 คัพเค้ก',        cost: 15, price: 65,  sold: 15 },
]

export default function MenuPage() {
  const [items, setItems]   = useState<MenuItem[]>(DEFAULT)
  const [nextId, setNextId] = useState(10)

  const update = (id: number, field: keyof MenuItem, val: string | number) =>
    setItems(prev => prev.map(m => m.id === id ? { ...m, [field]: val } : m))

  const addItem = () => {
    setItems(prev => [...prev, { id: nextId, name: '', cost: 0, price: 0, sold: 0 }])
    setNextId(n => n + 1)
  }

  const margins   = items.map(m => m.price > 0 ? ((m.price - m.cost) / m.price) * 100 : 0)
  const avgMargin = margins.reduce((a, b) => a + b, 0) / (margins.length || 1)
  const avgSold   = items.reduce((a, m) => a + m.sold, 0) / (items.length || 1)

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* HERO */}
      <div className="bg-white border-b border-cream-border px-6 py-4 flex items-center gap-4">
        <div className="text-2xl flex gap-1">
          {Array.from('☕🥐🎂🍪🧁🍫🥛').map((e, i) => <span key={i}>{e}</span>)}
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold text-coffee leading-tight">
            Menu Profitability Analyzer
          </h1>
          <p className="text-xs text-amber-600 font-light mt-0.5">
            วิเคราะห์ทุกเมนูด้วย Menu Engineering Matrix
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-4 flex flex-col gap-3">

        {/* INPUT TABLE */}
        <div className="bg-white border border-cream-border rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-cream-border">
            <span className="text-lg">📋</span>
            <span className="text-sm font-medium">ข้อมูลเมนู</span>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-[1fr_72px_72px_72px_28px] gap-1.5 mb-2">
              {['ชื่อเมนู', 'ต้นทุน(฿)', 'ราคา(฿)', 'ขายได้', ''].map(h => (
                <span key={h} className="text-[10px] text-muted text-center first:text-left">{h}</span>
              ))}
            </div>
            {items.map((item, idx) => (
              <div key={item.id} className="grid grid-cols-[1fr_72px_72px_72px_28px] gap-1.5 mb-2 items-center">
                <input value={item.name}
                  onChange={e => update(item.id, 'name', e.target.value)}
                  placeholder="ชื่อเมนู"
                  className="w-full px-2 py-1 text-xs rounded-lg border border-cream-border bg-cream
                             focus:outline-none focus:border-caramel" />
                {(['cost', 'price', 'sold'] as (keyof MenuItem)[]).map(field => (
                  <input key={field} type="number" min={0}
                    value={item[field] as number}
                    onChange={e => update(item.id, field, +e.target.value)}
                    className="w-full px-2 py-1 text-xs rounded-lg border border-cream-border bg-cream
                               focus:outline-none focus:border-caramel text-center" />
                ))}
                <button onClick={() => setItems(prev => prev.filter(m => m.id !== item.id))}
                  className="w-7 h-7 rounded-lg border border-cream-border bg-cream text-muted text-sm
                             flex items-center justify-center hover:bg-red-50 hover:border-red-300
                             hover:text-red-500 transition-colors">×</button>
              </div>
            ))}
            <button onClick={addItem}
              className="text-xs text-caramel hover:text-coffee transition-colors mt-1">＋ เพิ่มเมนู</button>
          </div>
        </div>

        {/* RESULTS */}
        <div className="bg-white border border-cream-border rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center gap-2 px-4 py-3 bg-amber-50 border-b border-amber-100">
            <span>✨</span>
            <span className="text-sm font-medium text-coffee">ผลวิเคราะห์เมนู</span>
            <span className="ml-auto text-xs text-amber-500">
              avg margin {avgMargin.toFixed(0)}% · avg sold {avgSold.toFixed(0)} ชิ้น
            </span>
          </div>
          <div className="divide-y divide-cream-border">
            {items.map((item, idx) => {
              const margin = item.price > 0 ? ((item.price - item.cost) / item.price) * 100 : 0
              const cat    = classify(margin, avgMargin, item.sold, avgSold)
              const style  = CAT_STYLE[cat]
              return (
                <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                  <span className="text-lg w-7 text-center">{style.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.name || `เมนู ${idx + 1}`}
                    </p>
                    <p className="text-[11px] text-muted">{style.tip}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-[11px] px-2.5 py-1 rounded-full border font-medium
                                     ${style.bg} ${style.text} ${style.border}`}>
                      {cat}
                    </span>
                    <p className="text-[10px] text-muted mt-1">margin {margin.toFixed(0)}%</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 p-4 border-t border-cream-border bg-cream">
            {(Object.entries(CAT_STYLE) as [Category, typeof CAT_STYLE[Category]][]).map(([cat, s]) => (
              <div key={cat} className={`flex items-start gap-2 p-2.5 rounded-xl border ${s.bg} ${s.border}`}>
                <span className="text-base">{s.emoji}</span>
                <div>
                  <p className={`text-xs font-medium ${s.text}`}>{cat}</p>
                  <p className="text-[10px] text-muted leading-snug">{s.tip}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
