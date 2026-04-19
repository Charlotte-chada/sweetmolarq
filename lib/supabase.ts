// lib/supabase.ts
// Supabase browser client — use in Client Components
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Fall back to placeholder values at build-time so static generation
  // doesn't crash. Real values MUST be set as env vars on the host (Vercel).
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key-for-build-only'
  return createBrowserClient(url, key)
}
