'use client'

import { useState, useEffect } from 'react'
import type { Ingredient, IngredientCategory, PackUnit } from '@/types'
import { PACK_UNIT_LABELS, CATEGORY_LABELS } from '@/types'

const CATEGORIES: IngredientCategory[] = ['ingredient','package','utility','admin','others']
const UNITS: PackUnit[]                = ['g','kg','ml','l','piece']

interface Props {
  initial?: Ingredient | null
  onSave:  (data: Omit<Ingredient,'id'|'user_id'|'created_at'|'updated_at'>) => Promise<void>
  onClose: () => void
}

const empty = {
  name: '', brand: '', category: 'ingredient' as IngredientCategory,
  price: 0, pack_size: 1, pack_unit: 'g' as PackUnit, note: '',
}

export default function IngredientModal({ initial, onSave, onClose }: Props) {
  const [form, setForm] = useState({ ...empty })
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  useEffect(() => {
    if (initial) setForm({
      name:      initial.name,
      brand:     initial.brand ?? '',
      category:  initial.category,
      price:     initial.price,
      pack_size: initial.pack_size,
      pack_unit: initial.pack_unit,
      note:      initial.note ?? '',
    })
  }, [initial])

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))

  const costPerUnit = form.pack_size > 0
    ? (form.price / form.pack_size).toFixed(4)
    : '—'

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) { setErr('กรุณาใส่ชื่อวัตถุดิบ'); return }
    if (form.price <= 0)   { setErr('ราคาต้องมากกว่า 0'); return }
    setSaving(true)
    setErr('')
    try {
      await onSave({
        name:      form.name.trim(),
        brand:     form.brand.trim() || null,
        category:  form.category,
        price:     Number(form.price),
        pack_size: Number(form.pack_size),
        pack_unit: form.pack_unit,
        note:      form.note.trim() || null,
      } as any)
      onClose()
    } catch (err: any) {
      setErr(err?.message ?? 'บันทึกไม่สำเร็จ กรุณาลองใหม่')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-900">
            {initial ? 'แก้ไขวัตถุดิบ' : '+ เพิ่มวัตถุดิบใหม่'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg font-light">✕</button>
        </div>

        <form onSubmit={submit} className="p-5 flex flex-col gap-4">
          {err && (
            <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {err}
            </div>
          )}

          {/* name + brand */}
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="label">ชื่อวัตถุดิบ *</label>
              <input
                className="input" placeholder="เช่น นมสด, แป้งสาลี"
                value={form.name}
                onChange={e => set('name', e.target.value)}
              />
            </div>
            <div>
              <label className="label">ยี่ห้อ / Note</label>
              <input
                className="input" placeholder="เช่น Dutch Mill, มิลค์แลนด์"
                value={form.brand}
                onChange={e => set('brand', e.target.value)}
              />
            </div>
            <div>
              <label className="label">ประเภท</label>
              <select className="input" value={form.category}
                onChange={e => set('category', e.target.value as IngredientCategory)}>
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
                ))}
              </select>
            </div>
          </div>

          {/* price + size + unit */}
          <div>
            <label className="label">ราคา / บรรจุภัณฑ์</label>
            <div className="flex gap-2 items-center">
              <span className="text-xs text-gray-400 whitespace-nowrap">฿</span>
              <input
                type="number" min="0" step="0.01" className="input w-24 text-right"
                placeholder="ราคา"
                value={form.price || ''}
                onChange={e => set('price', e.target.value)}
              />
              <span className="text-xs text-gray-400">/</span>
              <input
                type="number" min="0.001" step="0.001" className="input w-20 text-right"
                placeholder="ขนาด"
                value={form.pack_size || ''}
                onChange={e => set('pack_size', e.target.value)}
              />
              <select className="input flex-1" value={form.pack_unit}
                onChange={e => set('pack_unit', e.target.value as PackUnit)}>
                {UNITS.map(u => (
                  <option key={u} value={u}>{PACK_UNIT_LABELS[u]}</option>
                ))}
              </select>
            </div>
            {Number(form.price) > 0 && (
              <p className="text-[11px] text-orange-600 mt-1.5 font-medium">
                ≈ ฿{costPerUnit} / {form.pack_unit === 'piece' ? 'ชิ้น' : form.pack_unit}
              </p>
            )}
          </div>

          {/* note */}
          <div>
            <label className="label">หมายเหตุเพิ่มเติม</label>
            <textarea
              className="input resize-none" rows={2}
              placeholder="เช่น ซื้อที่ Makro, ราคาอาจเปลี่ยน..."
              value={form.note}
              onChange={e => set('note', e.target.value)}
            />
          </div>

          {/* actions */}
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2 text-xs font-semibold text-gray-500 bg-gray-50
                         border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors">
              ยกเลิก
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2 text-xs font-bold text-white rounded-xl
                         grad-bg hover:opacity-90 transition-opacity disabled:opacity-50">
              {saving ? 'กำลังบันทึก...' : 'บันทึก'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .label { display:block; font-size:0.7rem; font-weight:600; color:#6B7280; margin-bottom:0.3rem; }
        .input  { width:100%; padding:0.45rem 0.65rem; font-size:0.8rem; border:1.5px solid #E5E7EB;
                  border-radius:0.6rem; background:#F9FAFB; outline:none; font-family:inherit;
                  transition:border-color 0.15s; }
        .input:focus { border-color:#E8845A; background:#fff; }
      `}</style>
    </div>
  )
}
