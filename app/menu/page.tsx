"use client"

import { useState, useMemo, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import { useAuth } from '@/components/AuthProvider'
import { useRecipes } from '@/lib/useRecipes'
import { useIngredients } from '@/lib/useIngredients'
import { lineItemCost } from '@/types'
import type { Recipe } from '@/types'

// ── Types ──────────────────────────────────────────────────
type Category = 'Star' | 'Plow Horse' | 'Puzzle' | 'Dog'

interface MenuItem {
  id: string
  name: string
  costIngredient: number   // ต้นทุนวัตถุดิบ + packaging
  costUtility: number      // utility & other
  price: number
  sold: number             // ต่อเดือน
  priceMode: 'price' | 'margin'  // กรอกจากราคาขาย หรือ % กำไร
  marginPct: number        // % กำไรที่ต้องการ (ถ้าใช้ mode margin)
  _fromRecipe?: boolean
}

// ── Helpers ────────────────────────────────────────────────
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

// calculate effective selling price from mode
function effectivePrice(item: MenuItem): number {
  if (item.priceMode === 'price') return item.price
  const totalCost = item.costIngredient + item.costUtility
  if (item.marginPct >= 100) return totalCost * 10
  return totalCost / (1 - item.marginPct / 100)
}

let _nextId = 100

function makeId() { return String(++_nextId) }

// ── Main component ─────────────────────────────────────────
export default function MenuPage() {
  const { user } = useAuth()
  const { recipes, loading: recipesLoading } = useRecipes(user?.id)
  const { ingredients } = useIngredients(user?.id)

  // Build initial items from recipes (with calculated ingredient cost)
  const recipeItems = useMemo<MenuItem[]>(() => {
    return recipes.map(r => {
      const lines = r.recipe_lines ?? []
      const ingCost = lines.reduce((sum, line) => {
        const ing = line.ingredient
        if (!ing) return sum
        const cat = ing.category
        if (cat === 'ingredient' || cat === 'package') {
          return sum + lineItemCost(ing, line.quantity)
        }
        return sum
      }, 0)
      const utilityCost = lines.reduce((sum, line) => {
        const ing = line.ingredient
        if (!ing) return sum
        const cat = ing.category
        if (cat === 'utility' || cat === 'admin' || cat === 'others') {
          return sum + lineItemCost(ing, line.quantity)
        }
        return sum
      }, 0)
      const perUnit = r.batch_yield > 0 ? (ingCost + utilityCost) / r.batch_yield : ingCost
      return {
        id: r.id,
        name: r.name,
        costIngredient: r.batch_yield > 0 ? ingCost / r.batch_yield : ingCost,
        costUtility:    r.batch_yield > 0 ? utilityCost / r.batch_yield : utilityCost,
        price: 0,
        sold: 0,
        priceMode: 'price',
        marginPct: 60,
      }
    })
  }, [recipes])

  const [items, setItems] = useState<MenuItem[]>([])
  const [removedRecipeIds, setRemovedRecipeIds] = useState<Set<string>>(new Set())
  const [useRecipeData, setUseRecipeData] = useState(true)

  // Sync recipe items into state when recipes load or change
  useEffect(() => {
    if (recipesLoading) return
    setItems(prev => {
      if (!useRecipeData) {
        return prev.filter(m => !m._fromRecipe)
      }
      // Update cost/name for existing recipe items
      const updated = prev.map(m => {
        if (!m._fromRecipe) return m
        const fresh = recipeItems.find(r => r.id === m.id)
        if (!fresh) return m
        return { ...m, name: fresh.name, costIngredient: fresh.costIngredient, costUtility: fresh.costUtility }
      })
      // Add new recipe items not yet in state (and not removed by user)
      const existingIds = new Set(updated.map(m => m.id))
      const newItems = recipeItems
        .filter(r => !existingIds.has(r.id) && !removedRecipeIds.has(r.id))
        .map(r => ({ ...r, _fromRecipe: true as const }))
      return [...newItems, ...updated]
    })
  }, [recipeItems, recipesLoading, useRecipeData, removedRecipeIds])

  function updateItem(id: string, patch: Partial<MenuItem>) {
    setItems(prev => prev.map(m => m.id === id ? { ...m, ...patch } : m))
  }

  function addManual() {
    setItems(prev => [...prev, {
      id: makeId(),
      name: '', costIngredient: 0, costUtility: 0,
      price: 0, sold: 0, priceMode: 'price', marginPct: 60,
    }])
  }

  function removeItem(id: string) {
    const item = items.find(m => m.id === id)
    if (item?._fromRecipe) {
      setRemovedRecipeIds(prev => new Set([...prev, id]))
    }
    setItems(prev => prev.filter(m => m.id !== id))
  }

  const visibleItems = items

  const margins   = visibleItems.map(m => {
    const p = effectivePrice(m)
    const c = m.costIngredient + m.costUtility
    return p > 0 ? ((p - c) / p) * 100 : 0
  })
  const avgMargin = margins.reduce((a, b) => a + b, 0) / (margins.length || 1)
  const avgSold   = visibleItems.reduce((a, m) => a + m.sold, 0) / (visibleItems.length || 1)

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Noto Sans Thai', sans-serif" }}>
      <Navbar />

      {/* HERO */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
        <div className="text-2xl flex gap-1">
          {Array.from('☕🥐🎂🍪🧁🍫🥛').map((e, i) => <span key={i}>{e}</span>)}
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 leading-tight">Menu Profitability Analyzer</h1>
          <p className="text-xs text-amber-600 mt-0.5">วิเคราะห์กำไรและยอดขายของทุกเมนู</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 flex flex-col gap-4">

        {/* Recipe import toggle */}
        {user && (
          <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 flex items-center gap-3">
            <span className="text-base">🔗</span>
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-800">ดึงข้อมูลจาก Recipe Calculator</p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {recipesLoading ? 'กำลังโหลด...' : `พบ ${recipes.length} สูตร — ต้นทุนวัตถุดิบคำนวณอัตโนมัติ`}
              </p>
            </div>
            <button
              onClick={() => setUseRecipeData(v => !v)}
              className={`relative w-10 h-6 rounded-full transition-colors ${useRecipeData ? 'bg-orange-400' : 'bg-gray-200'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${useRecipeData ? 'translate-x-4' : 'translate-x-0.5'}`} />
            </button>
          </div>
        )}

        {/* INPUT TABLE */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
            <span className="text-base">📋</span>
            <span className="text-sm font-semibold text-gray-800">ข้อมูลเมนู</span>
          </div>

          {/* Header */}
          <div className="px-4 pt-3 pb-1 grid gap-1" style={{ gridTemplateColumns: '1fr 90px 90px 90px 90px 28px' }}>
            {['ชื่อเมนู', 'ต้นทุนวัตถุดิบ+pkg (฿)', 'ต้นทุน utility (฿)', 'ราคา/มาร์จิน', 'ขายได้ (ต่อเดือน)', ''].map(h => (
              <span key={h} className="text-[11px] font-semibold text-gray-400 text-center first:text-left leading-tight">{h}</span>
            ))}
          </div>

          {/* Rows */}
          <div className="px-4 pb-3 flex flex-col gap-2">
            {visibleItems.length === 0 && !recipesLoading && (
              <p className="text-xs text-gray-400 py-4 text-center">ยังไม่มีเมนู — กด "+ เพิ่มเมนู" หรือเปิด Recipe import</p>
            )}
            {recipesLoading && (
              <p className="text-xs text-gray-400 py-4 text-center">กำลังโหลด Recipe...</p>
            )}
            {visibleItems.map((item) => {
              const isFromRecipe = !!item._fromRecipe
              const effPrice = effectivePrice(item)
              const totalCost = item.costIngredient + item.costUtility
              return (
                <div key={item.id} className="grid gap-1 items-center" style={{ gridTemplateColumns: '1fr 90px 90px 90px 90px 28px' }}>
                  {/* name */}
                  <div className="flex items-center gap-1.5">
                    {isFromRecipe && <span className="text-[10px] px-1.5 py-0.5 bg-orange-50 text-orange-500 border border-orange-200 rounded-full font-bold whitespace-nowrap">Recipe</span>}
                    <input
                      value={item.name}
                      onChange={e => updateItem(item.id, { name: e.target.value })}
                      readOnly={isFromRecipe}
                      placeholder="ชื่อเมนู"
                      className={`w-full px-2 py-1.5 text-xs rounded-lg border bg-gray-50 focus:outline-none focus:border-orange-400 transition-colors ${isFromRecipe ? 'text-gray-500 cursor-default' : ''}`}
                      style={{ borderColor: '#e5e7eb' }}
                    />
                  </div>
                  {/* cost ingredient */}
                  <input type="number" min={0} step={0.01}
                    value={item.costIngredient || ''}
                    onChange={e => updateItem(item.id, { costIngredient: +e.target.value })}
                    readOnly={isFromRecipe}
                    placeholder="0"
                    className={`w-full px-2 py-1.5 text-xs rounded-lg border bg-gray-50 focus:outline-none focus:border-orange-400 text-center ${isFromRecipe ? 'text-orange-600 font-semibold cursor-default' : ''}`}
                    style={{ borderColor: '#e5e7eb' }}
                  />
                  {/* cost utility */}
                  <input type="number" min={0} step={0.01}
                    value={item.costUtility || ''}
                    onChange={e => updateItem(item.id, { costUtility: +e.target.value })}
                    readOnly={isFromRecipe}
                    placeholder="0"
                    className={`w-full px-2 py-1.5 text-xs rounded-lg border bg-gray-50 focus:outline-none focus:border-orange-400 text-center ${isFromRecipe ? 'text-yellow-600 font-semibold cursor-default' : ''}`}
                    style={{ borderColor: '#e5e7eb' }}
                  />
                  {/* price / margin toggle */}
                  <div className="flex flex-col gap-0.5">
                    <div className="flex rounded-lg overflow-hidden border text-[11px] font-bold" style={{ borderColor: '#e5e7eb' }}>
                      <button
                        onClick={() => updateItem(item.id, { priceMode: 'price' })}
                        className={`flex-1 py-0.5 transition-colors ${item.priceMode === 'price' ? 'bg-orange-400 text-white' : 'bg-gray-50 text-gray-400'}`}
                      >฿</button>
                      <button
                        onClick={() => updateItem(item.id, { priceMode: 'margin' })}
                        className={`flex-1 py-0.5 transition-colors ${item.priceMode === 'margin' ? 'bg-orange-400 text-white' : 'bg-gray-50 text-gray-400'}`}
                      >%</button>
                    </div>
                    {item.priceMode === 'price' ? (
                      <input type="number" min={0} step={0.5}
                        value={item.price || ''}
                        onChange={e => updateItem(item.id, { price: +e.target.value })}
                        placeholder="ราคา"
                        className="w-full px-2 py-1 text-xs rounded-lg border bg-gray-50 focus:outline-none focus:border-orange-400 text-center"
                        style={{ borderColor: '#e5e7eb' }}
                      />
                    ) : (
                      <div className="relative">
                        <input type="number" min={0} max={99} step={1}
                          value={item.marginPct || ''}
                          onChange={e => updateItem(item.id, { marginPct: +e.target.value })}
                          placeholder="60"
                          className="w-full px-2 py-1 text-xs rounded-lg border bg-gray-50 focus:outline-none focus:border-orange-400 text-center"
                          style={{ borderColor: '#e5e7eb' }}
                        />
                        <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[11px] text-gray-400">%</span>
                      </div>
                    )}
                    {effPrice > 0 && item.priceMode === 'margin' && (
                      <p className="text-[11px] text-center text-green-600 font-semibold">฿{effPrice.toFixed(0)}</p>
                    )}
                  </div>
                  {/* sold per month */}
                  <input type="number" min={0}
                    value={item.sold || ''}
                    onChange={e => updateItem(item.id, { sold: +e.target.value })}
                    placeholder="0"
                    className="w-full px-2 py-1.5 text-xs rounded-lg border bg-gray-50 focus:outline-none focus:border-orange-400 text-center"
                    style={{ borderColor: '#e5e7eb' }}
                  />
                  {/* delete */}
                  <button onClick={() => removeItem(item.id)}
                    className="w-7 h-7 rounded-lg border border-gray-200 bg-gray-50 text-gray-400 text-sm
                               flex items-center justify-center hover:bg-red-50 hover:border-red-200
                               hover:text-red-400 transition-colors">×</button>
                </div>
              )
            })}
            <button onClick={addManual}
              className="text-xs text-orange-500 hover:text-orange-700 transition-colors mt-1 text-left">
              ＋ เพิ่มเมนู
            </button>
          </div>
        </div>

        {/* RESULTS */}
        {visibleItems.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="flex items-center gap-2 px-4 py-3 bg-amber-50 border-b border-amber-100">
              <span>✨</span>
              <span className="text-sm font-semibold text-gray-800">ผลวิเคราะห์เมนู</span>
              <span className="ml-auto text-xs text-amber-600">
                avg margin {avgMargin.toFixed(0)}% · avg sold {avgSold.toFixed(0)} ชิ้น/เดือน
              </span>
            </div>
            <div className="divide-y divide-gray-100">
              {visibleItems.map((item) => {
                const p = effectivePrice(item)
                const c = item.costIngredient + item.costUtility
                const margin = p > 0 ? ((p - c) / p) * 100 : 0
                const cat    = classify(margin, avgMargin, item.sold, avgSold)
                const style  = CAT_STYLE[cat]
                const profit = (p - c) * item.sold
                return (
                  <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                    <span className="text-lg w-7 text-center">{style.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {item.name || '(ไม่มีชื่อ)'}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{style.tip}</p>
                      <div className="flex gap-2 mt-1 flex-wrap">
                        <span className="text-[10px] text-gray-500">
                          ต้นทุนรวม ฿{c.toFixed(2)} | ราคาขาย ฿{p.toFixed(0)}
                        </span>
                        {item.sold > 0 && (
                          <span className="text-[10px] text-green-600 font-medium">
                            กำไร/เดือน ฿{profit.toFixed(0)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`text-[11px] px-2.5 py-1 rounded-full border font-semibold
                                       ${style.bg} ${style.text} ${style.border}`}>
                        {cat}
                      </span>
                      <p className="text-[10px] text-gray-400 mt-1">margin {margin.toFixed(0)}%</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 p-4 border-t border-gray-100 bg-gray-50">
              {(Object.entries(CAT_STYLE) as [Category, typeof CAT_STYLE[Category]][]).map(([cat, s]) => (
                <div key={cat} className={`flex items-start gap-2 p-2.5 rounded-xl border ${s.bg} ${s.border}`}>
                  <span className="text-base">{s.emoji}</span>
                  <div>
                    <p className={`text-xs font-semibold ${s.text}`}>{cat}</p>
                    <p className="text-[10px] text-gray-500 leading-snug">{s.tip}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

