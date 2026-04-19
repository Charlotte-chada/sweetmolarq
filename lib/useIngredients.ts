'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase'
import type { Ingredient } from '@/types'

export function useIngredients(userId: string | undefined) {
  // Lazy client — only created in the browser, never during SSR
  const clientRef = useRef<ReturnType<typeof createClient> | null>(null)
  function getClient() {
    if (!clientRef.current) clientRef.current = createClient()
    return clientRef.current
  }
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState<string | null>(null)

  const fetch = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    const { data, error: e } = await getClient()
      .from('ingredients')
      .select('*')
      .order('created_at', { ascending: false })
    if (e) setError(e.message)
    else setIngredients(data as Ingredient[])
    setLoading(false)
  }, [userId])

  useEffect(() => { fetch() }, [fetch])

  const create = useCallback(async (
    payload: Omit<Ingredient, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ) => {
    if (!userId) return null
    const { data, error: e } = await getClient()
      .from('ingredients')
      .insert({ ...payload, user_id: userId })
      .select()
      .single()
    if (e) { setError(e.message); console.error('[Supabase insert error]', e); return null }
    setIngredients(prev => [data as Ingredient, ...prev])
    return data as Ingredient
  }, [userId])

  const update = useCallback(async (
    id: string,
    payload: Partial<Omit<Ingredient, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
  ) => {
    const { data, error: e } = await getClient()
      .from('ingredients')
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (e) { setError(e.message); return null }
    setIngredients(prev => prev.map(i => i.id === id ? data as Ingredient : i))
    return data as Ingredient
  }, [])

  const remove = useCallback(async (id: string) => {
    const { error: e } = await getClient()
      .from('ingredients')
      .delete()
      .eq('id', id)
    if (e) { setError(e.message); return false }
    setIngredients(prev => prev.filter(i => i.id !== id))
    return true
  }, [])

  return { ingredients, loading, error, create, update, remove, refetch: fetch }
}
