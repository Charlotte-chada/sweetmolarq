# SweetMolarQ — Setup Guide
# รัน commands เหล่านี้ใน project root

# ─── 1. Install packages ────────────────────────────────────
npm install @supabase/supabase-js @supabase/ssr

# ─── 2. สร้าง .env.local ────────────────────────────────────
# สร้างไฟล์ .env.local แล้วใส่ค่าจาก Supabase Dashboard:

# NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# ─── 3. Supabase Setup ─────────────────────────────────────
# 3a. ไปที่ https://supabase.com/dashboard → New project
# 3b. ไปที่ Settings → API → copy URL + anon key ใส่ .env.local
# 3c. ไปที่ SQL Editor → วาง supabase/schema.sql → Run

# ─── 4. เปิด Google OAuth ──────────────────────────────────
# ไปที่ Authentication → Providers → Google → Enable
# ต้องสร้าง Google OAuth credentials ที่:
# https://console.cloud.google.com/ → APIs & Services → Credentials
# → Create OAuth 2.0 Client ID
# Authorized redirect URI: https://xxxx.supabase.co/auth/v1/callback
# แล้วเอา Client ID + Secret มาใส่ใน Supabase → Google provider

# ─── 5. ตั้ง Site URL ───────────────────────────────────────
# Supabase → Authentication → URL Configuration
# Site URL: http://localhost:3000 (dev) หรือ https://sweetmolarq.com (prod)
# Redirect URLs: http://localhost:3000/auth/callback
#                https://sweetmolarq.com/auth/callback

# ─── 6. Copy files to project ───────────────────────────────
# วางไฟล์ทั้งหมดที่ได้ให้ถูก path:
#
# app/layout.tsx                           ← replace
# app/calculator/page.tsx                  ← replace
# app/auth/callback/route.ts               ← new
# components/AuthProvider.tsx              ← new
# components/UserMenu.tsx                  ← new
# components/calculator/IngredientLibrary.tsx ← new
# components/calculator/IngredientModal.tsx   ← new
# components/calculator/RecipeBuilder.tsx     ← new
# lib/supabase.ts                          ← new
# lib/useIngredients.ts                    ← new
# lib/useRecipes.ts                        ← new
# types/index.ts                           ← new

# ─── 7. Run ─────────────────────────────────────────────────
npm run dev
# เปิด http://localhost:3000/calculator
