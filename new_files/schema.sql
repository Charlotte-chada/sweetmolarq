-- ============================================================
-- SweetMolarQ — Supabase Schema
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- Enable Row Level Security
-- All tables are scoped to the authenticated user via user_id

-- ── 1. INGREDIENT LIBRARY ──────────────────────────────────
create table if not exists public.ingredients (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  brand       text,                        -- ยี่ห้อ / note
  category    text not null default 'ingredient'
              check (category in ('ingredient','package','utility','admin','others')),
  price       numeric(12,2) not null,      -- ราคาที่ซื้อมา (บาท)
  pack_size   numeric(12,4) not null,      -- ขนาดบรรจุ เช่น 1, 500, 1000
  pack_unit   text not null default 'g'   -- หน่วย: g, kg, ml, l, piece
              check (pack_unit in ('g','kg','ml','l','piece')),
  note        text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

alter table public.ingredients enable row level security;

create policy "Users manage own ingredients"
  on public.ingredients for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── 2. RECIPES ─────────────────────────────────────────────
create table if not exists public.recipes (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  name         text not null,
  category     text,
  batch_yield  integer not null default 1,  -- จำนวนชิ้นต่อ 1 batch
  note         text,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

alter table public.recipes enable row level security;

create policy "Users manage own recipes"
  on public.recipes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── 3. RECIPE LINES (ingredients used in a recipe) ─────────
create table if not exists public.recipe_lines (
  id            uuid primary key default gen_random_uuid(),
  recipe_id     uuid not null references public.recipes(id) on delete cascade,
  ingredient_id uuid not null references public.ingredients(id) on delete restrict,
  quantity      numeric(12,4) not null,    -- ปริมาณที่ใช้ (ในหน่วยเดียวกับ pack_unit)
  note          text,
  created_at    timestamptz default now()
);

-- recipe_lines inherits RLS via recipe ownership (join check)
alter table public.recipe_lines enable row level security;

create policy "Users manage own recipe lines"
  on public.recipe_lines for all
  using (
    exists (
      select 1 from public.recipes r
      where r.id = recipe_lines.recipe_id
        and r.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.recipes r
      where r.id = recipe_lines.recipe_id
        and r.user_id = auth.uid()
    )
  );

-- ── Indexes ─────────────────────────────────────────────────
create index on public.ingredients(user_id);
create index on public.recipes(user_id);
create index on public.recipe_lines(recipe_id);
