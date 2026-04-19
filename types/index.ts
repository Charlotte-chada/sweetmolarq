// ============================================================
// SweetMolarQ — Shared Types
// ============================================================

export type IngredientCategory =
  | 'ingredient'
  | 'package'
  | 'utility'
  | 'admin'
  | 'others'

export type PackUnit = 'g' | 'kg' | 'ml' | 'l' | 'piece'

/** One item in the ingredient library */
export interface Ingredient {
  id: string
  user_id: string
  name: string
  brand?: string | null
  category: IngredientCategory
  price: number       // บาท ต่อ pack หนึ่งอัน
  pack_size: number   // ขนาดบรรจุ (ตัวเลข)
  pack_unit: PackUnit // หน่วย
  note?: string | null
  created_at: string
  updated_at: string
}

/** Computed: cost per smallest unit (g / ml / piece) */
export type IngredientWithCost = Ingredient & {
  cost_per_unit: number   // บาท / หน่วยพื้นฐาน (g, ml, piece)
  display_unit: string    // สำหรับแสดงผล
}

/** One line inside a recipe */
export interface RecipeLine {
  id: string
  recipe_id: string
  ingredient_id: string
  quantity: number   // ปริมาณที่ใช้ (ในหน่วยเดียวกับ pack_unit ของ ingredient)
  note?: string | null
  created_at: string
}

/** Recipe with lines joined */
export interface Recipe {
  id: string
  user_id: string
  name: string
  category?: string | null
  batch_yield: number   // ได้ชิ้นต่อ batch
  note?: string | null
  created_at: string
  updated_at: string
  recipe_lines?: RecipeLineWithIngredient[]
}

export interface RecipeLineWithIngredient extends RecipeLine {
  ingredient: Ingredient
}

/** Calculation result for a recipe */
export interface RecipeCost {
  totalCostPerBatch: number
  costPerUnit: number
  lineBreakdown: {
    ingredient: Ingredient
    quantity: number
    lineCost: number
  }[]
}

/** Auth user (slim) */
export interface AppUser {
  id: string
  email?: string
  full_name?: string
  avatar_url?: string
}

// Display helpers
export const PACK_UNIT_LABELS: Record<PackUnit, string> = {
  g:      'กรัม (g)',
  kg:     'กิโลกรัม (kg)',
  ml:     'มิลลิลิตร (ml)',
  l:      'ลิตร (l)',
  piece:  'ชิ้น / อัน',
}

export const CATEGORY_LABELS: Record<IngredientCategory, string> = {
  ingredient: '🧂 Ingredient',
  package:    '📦 Package',
  utility:    '⚡ Utility',
  admin:      '🏢 Admin',
  others:     '📎 Others',
}

export const CATEGORY_COLORS: Record<IngredientCategory, string> = {
  ingredient: 'bg-orange-50 text-orange-700 border-orange-200',
  package:    'bg-blue-50   text-blue-700   border-blue-200',
  utility:    'bg-yellow-50 text-yellow-700 border-yellow-200',
  admin:      'bg-purple-50 text-purple-700 border-purple-200',
  others:     'bg-gray-50   text-gray-600   border-gray-200',
}

/**
 * Convert ingredient quantity to a per-gram/ml/piece cost
 * so recipes can compare apples-to-apples.
 */
export function costPerBaseUnit(ing: Ingredient): number {
  if (ing.pack_size === 0) return 0
  return ing.price / ing.pack_size
  // e.g. ฿55 / 1000g → ฿0.055/g
  // e.g. ฿220 / 1 kg → but pack_unit='kg', pack_size=1 → 220/1 = 220 บาท/kg
  // recipe line quantity is always in the same unit as pack_unit
}

/**
 * Calculate total cost for one recipe line
 * quantity is in pack_unit, price is per pack_size of that unit
 */
export function lineItemCost(ing: Ingredient, quantity: number): number {
  return (quantity / ing.pack_size) * ing.price
}
