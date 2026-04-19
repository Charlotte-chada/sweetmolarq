'use client'

import { useState } from 'react'
import type { Ingredient, IngredientCategory } from '@/types'
import { CATEGORY_LABELS, CATEGORY_COLORS, PACK_UNIT_LABELS, lineItemCost } from '@/types'
import IngredientModal from './IngredientModal'

interface Props {
  ingredients: Ingredient[]
  loading:     boolean
  onCreate:    (d: any) => Promise<any>
  onUpdate:    (id: string, d: any) => Promise<any>
  onDelete:    (id: string) => Promise<boolean>
}

const ALL = 'all'
type Filter = IngredientCategory | typeof ALL

export default function IngredientLibrary({ ingredients, loading, onCreate, onUpdate, onDelete }: Props) {
  const [modal, setModal]     = useState<'new' | Ingredient | null>(null)
  const [filter, setFilter]   = useState<Filter>(ALL)
  const [search, setSearch]   = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)

  const visible = ingredients.filter(i => {
    if (filter !== ALL && i.category !== filter) return false
    if (search && !i.name.toLowerCase().includes(search.toLowerCase()) &&
        !(i.brand ?? '').toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  async function handleDelete(id: string) {
    if (!confirm('ลบวัตถุดิบนี้? recipe ที่ใช้อยู่อาจมีปัญหา')) return
    setDeleting(id)
    await onDelete(id)
    setDeleting(null)
  }

  const cats: IngredientCategory[] = ['ingredient','package','utility','admin','others']

  return (
    <div className="flex flex-col gap-3">
      {/* toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <input
          className="flex-1 min-w-[160px] px-3 py-1.5 text-xs border border-gray-200
                     rounded-full bg-gray-50 focus:outline-none focus:border-accent"
          placeholder="🔍 ค้นหาชื่อ หรือ ยี่ห้อ..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="flex gap-1 flex-wrap">
          {[ALL, ...cats].map(c => (
            <button key={c}
              onClick={() => setFilter(c as Filter)}
              className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-colors ${
                filter === c
                  ? 'grad-bg text-white border-transparent'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-accent'
              }`}>
              {c === ALL ? 'ทั้งหมด' : CATEGORY_LABELS[c as IngredientCategory].split(' ')[1]}
            </button>
          ))}
        </div>
        <button
          onClick={() => setModal('new')}
          className="text-xs font-bold text-white px-3.5 py-1.5 rounded-full
                     grad-bg hover:opacity-90 transition-opacity whitespace-nowrap">
          + เพิ่มวัตถุดิบ
        </button>
      </div>

      {/* table */}
      {loading ? (
        <div className="py-10 text-center text-xs text-gray-400">กำลังโหลด...</div>
      ) : visible.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-2xl mb-2">🧂</p>
          <p className="text-xs font-semibold text-gray-500">ยังไม่มีวัตถุดิบ</p>
          <p className="text-[11px] text-gray-400 mt-1">กด "+ เพิ่มวัตถุดิบ" เพื่อเริ่มต้น</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {['ชื่อ / ยี่ห้อ','ประเภท','ราคา / แพ็ค','ขนาด','ราคา/หน่วย',''].map(h => (
                  <th key={h} className="px-3 py-2 text-left font-semibold text-gray-500 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {visible.map(ing => {
                const unitCost = ing.pack_size > 0
                  ? (ing.price / ing.pack_size).toFixed(3)
                  : '—'
                return (
                  <tr key={ing.id} className="hover:bg-orange-50/40 transition-colors">
                    <td className="px-3 py-2.5">
                      <p className="font-semibold text-gray-800">{ing.name}</p>
                      {ing.brand && <p className="text-[10px] text-gray-400 mt-0.5">{ing.brand}</p>}
                      {ing.note  && <p className="text-[10px] text-gray-400 italic">{ing.note}</p>}
                    </td>
                    <td className="px-3 py-2.5">
                      <span className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold
                                        ${CATEGORY_COLORS[ing.category]}`}>
                        {CATEGORY_LABELS[ing.category]}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 font-semibold text-gray-800">
                      ฿{ing.price.toLocaleString()}
                    </td>
                    <td className="px-3 py-2.5 text-gray-500">
                      {ing.pack_size} {ing.pack_unit}
                    </td>
                    <td className="px-3 py-2.5 font-semibold text-orange-700">
                      ฿{unitCost}/{ing.pack_unit}
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex gap-1.5 justify-end">
                        <button
                          onClick={() => setModal(ing)}
                          className="text-[10px] px-2 py-1 rounded-lg bg-gray-100
                                     hover:bg-gray-200 text-gray-600 transition-colors font-medium">
                          แก้ไข
                        </button>
                        <button
                          onClick={() => handleDelete(ing.id)}
                          disabled={deleting === ing.id}
                          className="text-[10px] px-2 py-1 rounded-lg bg-red-50
                                     hover:bg-red-100 text-red-500 transition-colors font-medium">
                          {deleting === ing.id ? '...' : 'ลบ'}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* summary */}
      {ingredients.length > 0 && (
        <p className="text-[10px] text-gray-400 text-right">
          แสดง {visible.length} / {ingredients.length} รายการ
        </p>
      )}

      {/* modal */}
      {modal && (
        <IngredientModal
          initial={modal === 'new' ? null : modal}
          onSave={async data => {
            let result: any = null
            if (modal === 'new') result = await onCreate(data)
            else                 result = await onUpdate((modal as Ingredient).id, data)
            if (result === null) {
              // Surface the actual Supabase error if available
              throw new Error('บันทึกไม่สำเร็จ — ดู console สำหรับรายละเอียด')
            }
          }}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}
