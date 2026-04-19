'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase'
import type { Recipe, RecipeLine } from '@/types'

export function useRecipes(userId: string | undefined) {
  // Stable client — created once, not every render
  const supabase = useMemo(() => createClient(), [])
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  const fetch = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    const { data, error: e } = await supabase
      .from('recipes')
      .select(`
        *,
        recipe_lines (
          *,
          ingredient:ingredients (*)
        )
      `)
      .order('created_at', { ascending: false })
    if (e) setError(e.message)
    else setRecipes(data as Recipe[])
    setLoading(false)
  }, [userId, supabase])

  useEffect(() => { fetch() }, [fetch])

  const createRecipe = useCallback(async (
    payload: Pick<Recipe, 'name' | 'category' | 'batch_yield' | 'note'>
  ) => {
    if (!userId) return null
    const { data, error: e } = await supabase
      .from('recipes')
      .insert({ ...payload, user_id: userId })
      .select()
      .single()
    if (e) { setError(e.message); return null }
    const newRecipe = { ...data, recipe_lines: [] } as Recipe
    setRecipes(prev => [newRecipe, ...prev])
    return newRecipe
  }, [userId, supabase])

  const updateRecipe = useCallback(async (
    id: string,
    payload: Partial<Pick<Recipe, 'name' | 'category' | 'batch_yield' | 'note'>>
  ) => {
    const { data, error: e } = await supabase
      .from('recipes')
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (e) { setError(e.message); return }
    setRecipes(prev => prev.map(r => r.id === id ? { ...r, ...data } : r))
  }, [supabase])

  const deleteRecipe = useCallback(async (id: string) => {
    const { error: e } = await supabase.from('recipes').delete().eq('id', id)
    if (e) { setError(e.message); return false }
    setRecipes(prev => prev.filter(r => r.id !== id))
    return true
  }, [supabase])

  // ── Recipe Lines ────────────────────────────────────────
  const addLine = useCallback(async (
    recipeId: string,
    line: { ingredient_id: string; quantity: number; note?: string }
  ) => {
    const { data, error: e } = await supabase
      .from('recipe_lines')
      .insert({ ...line, recipe_id: recipeId })
      .select(`*, ingredient:ingredients (*)`)
      .single()
    if (e) { setError(e.message); return }
    setRecipes(prev => prev.map(r =>
      r.id === recipeId
        ? { ...r, recipe_lines: [...(r.recipe_lines ?? []), data as any] }
        : r
    ))
  }, [supabase])

  const removeLine = useCallback(async (recipeId: string, lineId: string) => {
    const { error: e } = await supabase.from('recipe_lines').delete().eq('id', lineId)
    if (e) { setError(e.message); return }
    setRecipes(prev => prev.map(r =>
      r.id === recipeId
        ? { ...r, recipe_lines: (r.recipe_lines ?? []).filter(l => l.id !== lineId) }
        : r
    ))
  }, [supabase])

  const updateLine = useCallback(async (
    recipeId: string,
    lineId: string,
    payload: { quantity?: number; note?: string }
  ) => {
    const { data, error: e } = await supabase
      .from('recipe_lines')
      .update(payload)
      .eq('id', lineId)
      .select(`*, ingredient:ingredients (*)`)
      .single()
    if (e) { setError(e.message); return }
    setRecipes(prev => prev.map(r =>
      r.id === recipeId
        ? {
            ...r,
            recipe_lines: (r.recipe_lines ?? []).map(l =>
              l.id === lineId ? data as any : l
            ),
          }
        : r
    ))
  }, [supabase])

  return {
    recipes, loading, error, refetch: fetch,
    createRecipe, updateRecipe, deleteRecipe,
    addLine, removeLine, updateLine,
  }
}
