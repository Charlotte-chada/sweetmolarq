'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import IngredientLibrary from '@/components/calculator/IngredientLibrary'
import RecipeBuilder from '@/components/calculator/RecipeBuilder'
import { useAuth } from '@/components/AuthProvider'
import { useIngredients } from '@/lib/useIngredients'
import { useRecipes } from '@/lib/useRecipes'

type Tab = 'library' | 'recipe'

export default function CalculatorPage() {
  const { user, loading: authLoading, signInWithGoogle } = useAuth()
  const [tab, setTab] = useState<Tab>('library')

  const {
    ingredients, loading: ingLoading,
    create: createIng, update: updateIng, remove: removeIng,
  } = useIngredients(user?.id)

  const {
    recipes, loading: recLoading,
    createRecipe, updateRecipe, deleteRecipe,
    addLine, removeLine, updateLine,
  } = useRecipes(user?.id)

  // ── Auth loading ──────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-orange-400
                        rounded-full animate-spin" />
      </div>
    )
  }

  // ── Not signed in ─────────────────────────────────────────
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-6 py-20">
          <div className="max-w-sm w-full text-center">
            <div className="text-5xl mb-5">🔐</div>
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-2">
              เข้าสู่ระบบก่อนเริ่มใช้งาน
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-7">
              ข้อมูล Library และ Recipe ของคุณจะถูกบันทึกบน cloud
              และ sync ข้ามอุปกรณ์ได้อัตโนมัติ
            </p>
            <button
              onClick={signInWithGoogle}
              className="inline-flex items-center gap-3 w-full justify-center
                         py-3 px-6 bg-white border-2 border-gray-200 rounded-2xl
                         text-sm font-bold text-gray-700 shadow-sm
                         hover:border-orange-300 hover:bg-orange-50 transition-all"
            >
              <GoogleColorIcon />
              เข้าสู่ระบบด้วย Google
            </button>
            <p className="text-[11px] text-gray-400 mt-4">
              ฟรี 100% · ไม่มีค่าใช้จ่าย · ไม่ต้องใช้บัตรเครดิต
            </p>
            <div className="mt-8 flex gap-2 justify-center flex-wrap">
              {['🧂 บันทึก Library วัตถุดิบ','🧁 สร้างสูตรอาหาร','☁️ Sync ข้ามอุปกรณ์'].map(t => (
                <span key={t} className="text-[11px] px-3 py-1 bg-orange-50 text-orange-700
                                         border border-orange-200 rounded-full font-medium">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Signed in ─────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Noto Sans Thai',sans-serif" }}>
      <Navbar />

      {/* page header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              {(['☕','🧁','🥐','🎂','🍪','🍫'] as const).map((e, i) => (
                <span key={i} className="text-xl">{e}</span>
              ))}
            </div>
            <h1 className="text-xl font-extrabold text-gray-900 tracking-tight mt-1">
              Recipe Cost Calculator
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              จัดการ Library วัตถุดิบ และคำนวณต้นทุนสูตรอาหาร
            </p>
          </div>
          {/* quick stats */}
          <div className="flex gap-3">
            <Stat label="วัตถุดิบ" value={ingredients.length} />
            <Stat label="สูตร"     value={recipes.length} />
          </div>
        </div>
      </div>

      {/* tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="max-w-5xl mx-auto flex gap-0">
          {([
            { key: 'library', label: '🧂 Library วัตถุดิบ' },
            { key: 'recipe',  label: '🧁 สูตรอาหาร' },
          ] as { key: Tab; label: string }[]).map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-5 py-3 text-xs font-bold border-b-2 transition-colors ${
                tab === t.key
                  ? 'border-accent text-accent-dk'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* content */}
      <div className="max-w-5xl mx-auto px-6 py-6">
        {tab === 'library' ? (
          <IngredientLibrary
            ingredients={ingredients}
            loading={ingLoading}
            onCreate={createIng}
            onUpdate={updateIng}
            onDelete={removeIng}
          />
        ) : (
          <RecipeBuilder
            recipes={recipes}
            ingredients={ingredients}
            loading={recLoading}
            onCreate={createRecipe}
            onUpdate={updateRecipe}
            onDelete={deleteRecipe}
            onAddLine={addLine}
            onRemoveLine={removeLine}
            onUpdateLine={updateLine}
          />
        )}
      </div>
    </div>
  )
}

/* ── Sub-components ── */

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center px-4 py-2 bg-orange-50 border border-orange-200 rounded-xl">
      <p className="text-lg font-extrabold grad-text leading-none">{value}</p>
      <p className="text-[10px] text-gray-500 mt-0.5 font-medium">{label}</p>
    </div>
  )
}

function GoogleColorIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}
