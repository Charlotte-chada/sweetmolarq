'use client'

import { useState, useCallback } from 'react'
import { Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google'

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

// ---- Types ----
type Ingredient = {
  id: number
  name: string
  grams: number
  pricePerKg: number
}

type Category = {
  label: string
  emoji: string
  color: string
}

const CATEGORIES: Category[] = [
  { label: 'เบเกอรี่', emoji: '🥐', color: 'amber' },
  { label: 'เค้ก',    emoji: '🎂', color: 'yellow' },
  { label: 'เครื่องดื่ม', emoji: '☕', color: 'green' },
  { label: 'คุกกี้',  emoji: '🍪', color: 'purple' },
  { label: 'ช็อกโกแลต', emoji: '🍫', color: 'caramel' },
]

const DEFAULT_INGREDIENTS: Ingredient[] = [
  { id: 1, name: '🥛 นม',      grams: 300, pricePerKg: 55 },
  { id: 2, name: '🧈 เนย',     grams: 120, pricePerKg: 220 },
  { id: 3, name: '🌾 แป้ง',    grams: 200, pricePerKg: 35 },
  { id: 4, name: '🥚 ไข่',     grams: 100, pricePerKg: 90 },
  { id: 5, name: '🍬 น้ำตาล', grams: 80,  pricePerKg: 40 },
]

const CAT_STYLES: Record<string, string> = {
  amber:   'bg-amber-50   border-amber-200   text-amber-700',
  yellow:  'bg-yellow-50  border-yellow-200  text-yellow-700',
  green:   'bg-green-50   border-green-200   text-green-700',
  purple:  'bg-purple-50  border-purple-200  text-purple-700',
  caramel: 'bg-orange-50  border-orange-200  text-orange-700',
}

export default function CalculatorPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>(DEFAULT_INGREDIENTS)
  const [portions, setPortions]       = useState(12)
  const [overhead, setOverhead]       = useState(20)
  const [packaging, setPackaging]     = useState(5)
  const [margin, setMargin]           = useState(65)
  const [category, setCategory]       = useState<Category>(CATEGORIES[1])
  const [nextId, setNextId]           = useState(10)

  // ---- Calculations ----
  const ingCost     = ingredients.reduce((sum, ing) => sum + (ing.grams / 1000) * ing.pricePerKg, 0)
  const batchCost   = ingCost + overhead
  const costPerUnit = batchCost / Math.max(portions, 1)
  const fullCost    = costPerUnit + packaging
  const sellPrice   = fullCost / (1 - margin / 100)
  const fcPct       = sellPrice > 0 ? (costPerUnit / sellPrice) * 100 : 0
  const status      = ingCost === 0 ? 'empty' : fcPct <= 30 ? 'good' : fcPct <= 40 ? 'warn' : 'bad'

  const updateIng = useCallback((id: number, field: keyof Ingredient, value: string | number) => {
    setIngredients(prev => prev.map(ing => ing.id === id ? { ...ing, [field]: value } : ing))
  }, [])

  const addIng = () => {
    setIngredients(prev => [...prev, { id: nextId, name: '', grams: 0, pricePerKg: 0 }])
    setNextId(n => n + 1)
  }

  const removeIng = (id: number) => setIngredients(prev => prev.filter(ing => ing.id !== id))

  return (
    <div className={`${cormorant.variable} ${jakarta.variable} min-h-screen bg-cream font-body`}>

      {/* NAV */}
      <nav className="flex items-center justify-between px-6 py-3 bg-white border-b border-cream-border">
        <a href="/" className="font-display text-xl font-semibold text-coffee">
          SweetMolar<sup className="text-[10px] text-caramel font-body font-normal">Q</sup>
        </a>
        <div className="flex gap-2">
          {[{ href: '/calculator', label: '🧮 ต้นทุน', active: true  },
            { href: '/menu',       label: '📊 เมนู',    active: false },
            { href: '/breakeven',  label: '💰 Break-even', active: false }]
            .map(link => (
              <a key={link.href} href={link.href}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  link.active
                    ? 'bg-amber-50 border-amber-200 text-coffee font-medium'
                    : 'border-cream-border text-muted hover:border-caramel'
                }`}>
                {link.label}
              </a>
            ))}
        </div>
      </nav>

      {/* HERO STRIP */}
      <div className="bg-white border-b border-cream-border px-6 py-4 flex items-center gap-4">
        <div className="text-2xl flex gap-1">
          {Array.from('☕🫘🥐🎂🍪🧁🍫🥛🍰🫖').map((e, i) => <span key={i}>{e}</span>)}
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold text-coffee">Recipe Cost Calculator</h1>
          <p className="text-xs text-amber-600 font-light mt-0.5">ใส่ส่วนผสม → รู้ต้นทุนและราคาขายที่เหมาะสมทันที</p>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="max-w-3xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-3">

        {/* INGREDIENTS PANEL */}
        <div className="bg-white border border-cream-border rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-cream-border">
            <span className="text-lg">🧾</span>
            <span className="text-sm font-medium">ส่วนผสม (Ingredients)</span>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-[1fr_64px_72px_28px] gap-1.5 mb-2">
              <span className="text-[10px] text-muted">ชื่อส่วนผสม</span>
              <span className="text-[10px] text-muted text-center">กรัม</span>
              <span className="text-[10px] text-muted text-center">฿/กก.</span>
              <span></span>
            </div>
            {ingredients.map(ing => (
              <div key={ing.id} className="grid grid-cols-[1fr_64px_72px_28px] gap-1.5 mb-2 items-center">
                <input value={ing.name} onChange={e => updateIng(ing.id, 'name', e.target.value)}
                  placeholder="ชื่อส่วนผสม"
                  className="w-full px-2 py-1 text-xs rounded-lg border border-cream-border bg-cream
                             focus:outline-none focus:border-caramel" />
                <input type="number" min={0} value={ing.grams}
                  onChange={e => updateIng(ing.id, 'grams', +e.target.value)}
                  className="w-full px-2 py-1 text-xs rounded-lg border border-cream-border bg-cream
                             focus:outline-none focus:border-caramel text-center" />
                <input type="number" min={0} value={ing.pricePerKg}
                  onChange={e => updateIng(ing.id, 'pricePerKg', +e.target.value)}
                  className="w-full px-2 py-1 text-xs rounded-lg border border-cream-border bg-cream
                             focus:outline-none focus:border-caramel text-center" />
                <button onClick={() => removeIng(ing.id)}
                  className="w-7 h-7 rounded-lg border border-cream-border bg-cream text-muted
                             flex items-center justify-center hover:bg-red-50 hover:border-red-300
                             hover:text-red-500 transition-colors text-sm">×</button>
              </div>
            ))}
            <button onClick={addIng}
              className="text-xs text-caramel hover:text-coffee transition-colors mt-1">
              ＋ เพิ่มส่วนผสม
            </button>
          </div>
        </div>

        {/* RECIPE INFO PANEL */}
        <div className="bg-white border border-cream-border rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-cream-border">
            <span className="text-lg">⚙️</span>
            <span className="text-sm font-medium">ข้อมูล Recipe</span>
          </div>
          <div className="p-4 space-y-3">
            {[{ label: '🍽️ จำนวน (ชิ้น/แก้ว)', val: portions, set: setPortions, unit: 'ชิ้น'     },
              { label: '⚡ ค่าใช้จ่ายอื่น',       val: overhead, set: setOverhead, unit: '฿/batch'  },
              { label: '📦 ค่า packaging',         val: packaging,set: setPackaging,unit: '฿/ชิ้น'  }]
              .map(row => (
                <div key={row.label} className="flex items-center justify-between">
                  <span className="text-xs text-muted">{row.label}</span>
                  <div className="flex items-center gap-1">
                    <input type="number" min={0} value={row.val}
                      onChange={e => row.set(+e.target.value)}
                      className="w-20 px-2 py-1 text-xs rounded-lg border border-cream-border
                                 bg-cream text-right focus:outline-none focus:border-caramel" />
                    <span className="text-[10px] text-muted w-12">{row.unit}</span>
                  </div>
                </div>
              ))}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted">📈 Margin เป้าหมาย</span>
                <span className="text-coffee font-medium">{margin}%</span>
              </div>
              <input type="range" min={20} max={85} step={1} value={margin}
                onChange={e => setMargin(+e.target.value)}
                className="w-full accent-caramel" />
            </div>
            <div>
              <p className="text-xs text-muted mb-1.5">🏷️ ประเภท</p>
              <div className="flex gap-1.5 flex-wrap">
                {CATEGORIES.map(cat => (
                  <button key={cat.label} onClick={() => setCategory(cat)}
                    className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors ${
                      category.label === cat.label
                        ? CAT_STYLES[cat.color]
                        : 'border-cream-border text-muted bg-cream hover:border-caramel'
                    }`}>
                    {cat.emoji} {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RESULT PANEL — full width */}
        <div className="md:col-span-2 bg-white border border-cream-border rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center gap-2 px-5 py-3 bg-amber-50 border-b border-amber-100">
            <span>✨</span>
            <span className="text-sm font-medium text-coffee">ผลการคำนวณ</span>
            <span className="ml-auto text-xs text-amber-500">{category.emoji} {category.label}</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-cream-border">
            {[{ emoji: '🫙', label: 'ต้นทุนวัตถุดิบ/batch', value: `฿${batchCost.toFixed(0)}`,  sub: `฿${costPerUnit.toFixed(1)}/ชิ้น` },
              { emoji: '🏷️', label: 'ต้นทุนรวมต่อชิ้น',     value: `฿${fullCost.toFixed(1)}`,  sub: 'รวม overhead+pack'               },
              { emoji: '💰', label: 'ราคาขายแนะนำ',          value: `฿${Math.ceil(sellPrice)}`, sub: `margin ${margin}%`, green: true    },
              { emoji: '📊', label: 'Food cost %',            value: `${fcPct.toFixed(0)}%`,     sub: 'เป้า <35%',
                colorClass: status==='good'?'text-green-600':status==='bad'?'text-red-500':'text-coffee' }]
              .map((cell, i) => (
                <div key={i} className="p-4 text-center">
                  <div className="text-2xl mb-1">{cell.emoji}</div>
                  <div className="text-[10px] text-muted mb-0.5">{cell.label}</div>
                  <div className={`font-display text-2xl font-semibold ${
                    cell.colorClass ?? (cell.green ? 'text-green-700' : 'text-coffee')
                  }`}>{cell.value}</div>
                  <div className="text-[10px] text-muted mt-0.5">{cell.sub}</div>
                </div>
              ))}
          </div>
          <div className="flex items-center gap-3 px-5 py-3 border-t border-cream-border flex-wrap">
            {status === 'empty' && <span className="text-xs text-muted">กรอกส่วนผสมเพื่อดูคำแนะนำ</span>}
            {status === 'good'  && <><span className="text-xs px-3 py-1 rounded-full bg-green-50 border border-green-200 text-green-700 font-medium">✓ กำไรดี</span><span className="text-xs text-muted">Food cost {fcPct.toFixed(0)}% — ดีมาก! เหมาะสำหรับ promote</span></>}
            {status === 'warn'  && <><span className="text-xs px-3 py-1 rounded-full bg-yellow-50 border border-yellow-200 text-yellow-700 font-medium">⚠ พอได้</span><span className="text-xs text-muted">Food cost {fcPct.toFixed(0)}% — ลองลดต้นทุนหรือขึ้นราคาเล็กน้อย</span></>}
            {status === 'bad'   && <><span className="text-xs px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 font-medium">✗ ควรปรับ</span><span className="text-xs text-muted">Food cost {fcPct.toFixed(0)}% — สูงเกินไป ควรลดต้นทุนหรือปรับราคาขาย</span></>}
          </div>
        </div>

      </div>
    </div>
  )
}