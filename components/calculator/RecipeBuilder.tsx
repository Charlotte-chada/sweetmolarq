'use client'

import { useState } from 'react'
import type { Recipe, Ingredient, RecipeLineWithIngredient } from '@/types'
import { PACK_UNIT_LABELS, lineItemCost } from '@/types'

interface Props {
  recipes:      Recipe[]
  ingredients:  Ingredient[]
  loading:      boolean
  onCreate:     (d: Pick<Recipe,'name'|'category'|'batch_yield'|'note'>) => Promise<any>
  onUpdate:     (id: string, d: any) => Promise<void>
  onDelete:     (id: string) => Promise<boolean>
  onAddLine:    (recipeId: string, line: { ingredient_id: string; quantity: number; note?: string }) => Promise<void>
  onRemoveLine: (recipeId: string, lineId: string) => Promise<void>
  onUpdateLine: (recipeId: string, lineId: string, payload: { quantity?: number }) => Promise<void>
}

export default function RecipeBuilder({
  recipes, ingredients, loading,
  onCreate, onUpdate, onDelete,
  onAddLine, onRemoveLine, onUpdateLine,
}: Props) {
  const [activeId, setActiveId]         = useState<string | null>(null)
  const [creating, setCreating]         = useState(false)
  const [newName, setNewName]           = useState('')
  const [newYield, setNewYield]         = useState(1)
  const [newCategory, setNewCategory]   = useState('')
  const [addIngId, setAddIngId]         = useState('')
  const [addQty, setAddQty]             = useState<number>(0)
  const [addNote, setAddNote]           = useState('')
  const [saving, setSaving]             = useState(false)

  const active = recipes.find(r => r.id === activeId) ?? null

  // ── Cost calculation ──────────────────────────────────────
  function calcCost(recipe: Recipe) {
    const lines = (recipe.recipe_lines ?? []) as RecipeLineWithIngredient[]
    const total = lines.reduce((sum, l) => sum + lineItemCost(l.ingredient, l.quantity), 0)
    const perUnit = recipe.batch_yield > 0 ? total / recipe.batch_yield : 0
    return { total, perUnit }
  }

  // ── Create recipe ─────────────────────────────────────────
  async function handleCreate() {
    if (!newName.trim()) return
    setSaving(true)
    const r = await onCreate({
      name:        newName.trim(),
      category:    newCategory.trim() || null as any,
      batch_yield: newYield,
      note:        null,
    })
    setSaving(false)
    setCreating(false)
    setNewName(''); setNewYield(1); setNewCategory('')
    if (r) setActiveId(r.id)
  }

  // ── Add ingredient line ───────────────────────────────────
  async function handleAddLine() {
    if (!activeId || !addIngId || addQty <= 0) return
    await onAddLine(activeId, {
      ingredient_id: addIngId,
      quantity:      addQty,
      note:          addNote.trim() || undefined,
    })
    setAddIngId(''); setAddQty(0); setAddNote('')
  }

  const selectedIng = ingredients.find(i => i.id === addIngId)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4 min-h-[500px]">

      {/* ── SIDEBAR: recipe list ── */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">สูตรอาหาร</span>
          <button
            onClick={() => { setCreating(true); setActiveId(null) }}
            className="text-[11px] font-bold text-white px-3 py-1.5 rounded-full
                       grad-bg hover:opacity-90 transition-opacity">
            + สูตรใหม่
          </button>
        </div>

        {/* new recipe form */}
        {creating && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 flex flex-col gap-2">
            <input
              autoFocus
              className="input text-xs" placeholder="ชื่อสูตร *"
              value={newName} onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
            />
            <input
              className="input text-xs" placeholder="ประเภท (เค้ก, กาแฟ...)"
              value={newCategory} onChange={e => setNewCategory(e.target.value)}
            />
            <div className="flex items-center gap-2">
              <label className="text-[10px] text-gray-500 whitespace-nowrap">ได้</label>
              <input
                type="number" min={1} className="input text-xs w-16 text-center"
                value={newYield} onChange={e => setNewYield(Number(e.target.value))}
              />
              <label className="text-[10px] text-gray-500">ชิ้น / batch</label>
            </div>
            <div className="flex gap-1.5">
              <button onClick={() => setCreating(false)}
                className="flex-1 text-[11px] py-1.5 rounded-lg bg-white border border-gray-200
                           text-gray-500 hover:bg-gray-50 transition-colors">
                ยกเลิก
              </button>
              <button onClick={handleCreate} disabled={saving || !newName.trim()}
                className="flex-1 text-[11px] py-1.5 rounded-lg grad-bg text-white
                           hover:opacity-90 transition-opacity disabled:opacity-40">
                {saving ? '...' : 'สร้าง'}
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="py-8 text-center text-xs text-gray-400">กำลังโหลด...</div>
        ) : recipes.length === 0 && !creating ? (
          <div className="py-8 text-center text-xs text-gray-400">
            <p className="text-xl mb-1">🧁</p>
            ยังไม่มีสูตร กด "+ สูตรใหม่"
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            {recipes.map(r => {
              const { total, perUnit } = calcCost(r)
              const isActive = r.id === activeId
              return (
                <button
                  key={r.id}
                  onClick={() => setActiveId(isActive ? null : r.id)}
                  className={`text-left px-3 py-2.5 rounded-xl border transition-all ${
                    isActive
                      ? 'bg-orange-50 border-orange-300 shadow-sm'
                      : 'bg-white border-gray-200 hover:border-orange-200'
                  }`}>
                  <p className="text-xs font-bold text-gray-800 truncate">{r.name}</p>
                  {r.category && (
                    <p className="text-[10px] text-gray-400">{r.category}</p>
                  )}
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-gray-400">
                      {(r.recipe_lines ?? []).length} รายการ · {r.batch_yield} ชิ้น/batch
                    </span>
                    {total > 0 && (
                      <span className="text-[10px] font-bold text-orange-600">
                        ฿{perUnit.toFixed(2)}/ชิ้น
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* ── MAIN: recipe detail ── */}
      {active ? (
        <div className="bg-white border border-gray-200 rounded-2xl flex flex-col overflow-hidden">
          {/* recipe header */}
          <div className="px-5 py-4 border-b border-gray-100 flex items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-gray-900">{active.name}</h3>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {active.category && <>{active.category} · </>}
                ได้ <strong className="text-gray-700">{active.batch_yield}</strong> ชิ้น / batch
              </p>
            </div>
            <button
              onClick={() => onDelete(active.id).then(ok => ok && setActiveId(null))}
              className="text-[10px] text-red-400 hover:text-red-600 transition-colors px-2 py-1
                         rounded-lg hover:bg-red-50 font-medium">
              ลบสูตร
            </button>
          </div>

          {/* ingredient lines */}
          <div className="flex-1 overflow-y-auto">
            {(active.recipe_lines ?? []).length === 0 ? (
              <div className="py-10 text-center text-xs text-gray-400">
                <p className="text-2xl mb-2">🧂</p>
                ยังไม่มีส่วนผสม — เพิ่มด้านล่าง
              </div>
            ) : (
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {['ส่วนผสม','ปริมาณ','ต้นทุน',''].map(h => (
                      <th key={h} className="px-4 py-2 text-left font-semibold text-gray-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {(active.recipe_lines as RecipeLineWithIngredient[]).map(line => {
                    const cost = lineItemCost(line.ingredient, line.quantity)
                    return (
                      <tr key={line.id} className="hover:bg-orange-50/30 transition-colors">
                        <td className="px-4 py-2.5">
                          <p className="font-semibold text-gray-800">{line.ingredient.name}</p>
                          {line.ingredient.brand && (
                            <p className="text-[10px] text-gray-400">{line.ingredient.brand}</p>
                          )}
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-1">
                            <input
                              type="number" min={0} step={0.1}
                              defaultValue={line.quantity}
                              onBlur={e => {
                                const v = Number(e.target.value)
                                if (v !== line.quantity)
                                  onUpdateLine(active.id, line.id, { quantity: v })
                              }}
                              className="w-16 px-2 py-1 text-xs border border-gray-200 rounded-lg
                                         bg-gray-50 text-right focus:outline-none focus:border-accent"
                            />
                            <span className="text-[10px] text-gray-400">{line.ingredient.pack_unit}</span>
                          </div>
                        </td>
                        <td className="px-4 py-2.5 font-semibold text-orange-700">
                          ฿{cost.toFixed(2)}
                        </td>
                        <td className="px-4 py-2.5">
                          <button
                            onClick={() => onRemoveLine(active.id, line.id)}
                            className="text-gray-300 hover:text-red-400 transition-colors text-base font-light">
                            ×
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* add ingredient row */}
          <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
              เพิ่มส่วนผสม
            </p>
            <div className="flex gap-2 flex-wrap items-end">
              <div className="flex-1 min-w-[160px]">
                <select
                  className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg
                             bg-white focus:outline-none focus:border-accent"
                  value={addIngId}
                  onChange={e => { setAddIngId(e.target.value); setAddQty(0) }}
                >
                  <option value="">— เลือกวัตถุดิบ —</option>
                  {ingredients.map(i => (
                    <option key={i.id} value={i.id}>
                      {i.name}{i.brand ? ` (${i.brand})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {selectedIng && (
                <div className="flex items-center gap-1">
                  <input
                    type="number" min={0} step={0.1}
                    className="w-20 px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg
                               bg-white text-right focus:outline-none focus:border-accent"
                    placeholder="ปริมาณ"
                    value={addQty || ''}
                    onChange={e => setAddQty(Number(e.target.value))}
                  />
                  <span className="text-[10px] text-gray-500">{selectedIng.pack_unit}</span>
                  {addQty > 0 && (
                    <span className="text-[10px] text-orange-600 font-semibold">
                      = ฿{lineItemCost(selectedIng, addQty).toFixed(2)}
                    </span>
                  )}
                </div>
              )}

              <button
                onClick={handleAddLine}
                disabled={!addIngId || addQty <= 0}
                className="text-xs font-bold text-white px-3.5 py-1.5 rounded-lg
                           grad-bg hover:opacity-90 transition-opacity disabled:opacity-30">
                + เพิ่ม
              </button>
            </div>
          </div>

          {/* cost summary */}
          {(() => {
            const { total, perUnit } = calcCost(active)
            if (!total) return null
            return (
              <div className="border-t border-gray-200 px-5 py-4
                              bg-gradient-to-r from-orange-50 to-pink-50">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-[10px] text-gray-400 mb-1">ต้นทุน / batch</p>
                    <p className="text-xl font-black grad-text">฿{total.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 mb-1">ได้ทั้งหมด</p>
                    <p className="text-xl font-black text-gray-800">{active.batch_yield} ชิ้น</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 mb-1">ต้นทุน / ชิ้น</p>
                    <p className="text-xl font-black grad-text">฿{perUnit.toFixed(2)}</p>
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <p className="text-[10px] text-gray-400">
                    ถ้าต้องการ margin 65% → ราคาขายแนะนำ{' '}
                    <strong className="text-orange-600">
                      ฿{(perUnit / (1 - 0.65)).toFixed(0)}
                    </strong>
                    {' '}/ ชิ้น
                  </p>
                </div>
              </div>
            )
          })()}
        </div>
      ) : (
        <div className="hidden lg:flex items-center justify-center bg-gray-50
                        border-2 border-dashed border-gray-200 rounded-2xl">
          <div className="text-center">
            <p className="text-3xl mb-3">🧁</p>
            <p className="text-sm font-semibold text-gray-400">เลือกสูตรจากรายการ</p>
            <p className="text-xs text-gray-300 mt-1">หรือสร้างสูตรใหม่</p>
          </div>
        </div>
      )}
    </div>
  )
}
