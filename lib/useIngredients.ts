'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase'
import type { Ingredient } from '@/types'

export function useIngredients(userId: string | undefined) {
  // Stable client — created once, not every render
  const supabase = useMemo(() => createClient(), [])
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState<string | null>(null)

  const fetch = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    const { data, error: e } = await supabase
      .from('ingredients')
      .select('*')
      .order('created_at', { ascending: false })
    if (e) setError(e.message)
    else setIngredients(data as Ingredient[])
    setLoading(false)
  }, [userId, supabase])

  useEffect(() => { fetch() }, [fetch])

  const create = useCallback(async (
    payload: Omit<Ingredient, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ) => {
    if (!userId) return null
    const { data, error: e } = await supabase
      .from('ingredients')
      .insert({ ...payload, user_id: userId })
      .select()
      .single()
    if (e) { setError(e.message); console.error('[Supabase insert error]', e); return null }
    setIngredients(prev => [data as Ingredient, ...prev])
    return data as Ingredient
  }, [userId, supabase])

  const update = useCallback(async (
    id: string,
    payload: Partial<Omit<Ingredient, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
  ) => {
    const { data, error: e } = await supabase
      .from('ingredients')
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (e) { setError(e.message); return null }
    setIngredients(prev => prev.map(i => i.id === id ? data as Ingredient : i))
    return data as Ingredient
  }, [supabase])

  const remove = useCallback(async (id: string) => {
    const { error: e } = await supabase
      .from('ingredients')
      .delete()
      .eq('id', id)
    if (e) { setError(e.message); return false }
    setIngredients(prev => prev.filter(i => i.id !== id))
    return true
  }, [supabase])

  return { ingredients, loading, error, create, update, remove, refetch: fetch }
}
