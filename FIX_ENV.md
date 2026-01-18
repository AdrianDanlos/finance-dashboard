# Fix Your .env.local File

## The Problem
Your `NEXT_PUBLIC_SUPABASE_URL` has the wrong value. It should be a URL, not a key.

**Wrong:** `sb_publishable_Dt4ijxbcX3Q713LE3woEBg_oPoybOvr`  
**Correct:** `https://xxxxx.supabase.co` (starts with `https://`)

## How to Fix

### Step 1: Get the Correct Project URL

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Click **Settings** (gear icon) in the left sidebar
3. Click **"API"** under Project Settings
4. Look for **"Project URL"** at the top
   - It should look like: `https://vnahkobqzpnturnayq.supabase.co`
   - Copy this entire URL

### Step 2: Update Your .env.local File

Open `.env.local` in your project root and replace the URL:

```env
NEXT_PUBLIC_SUPABASE_URL=https://vnahkobqzpnturnayq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZuYWhrb2JxZ3pwbnN0dXJuYXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3NDkwMDgsImV4cCI6MjA4NDMyNTAwOH0.VPlWVR8c7FxbxaR708-xK3QaxHrav2h8jIrfQoWu1jQ
ALLOWED_EMAIL=danlosadrian@gmail.com
```

**Important:** 
- The URL must start with `https://`
- The URL must end with `.supabase.co`
- No quotes needed around the values

### Step 3: Restart Your Dev Server

1. Stop the server (press `Ctrl+C` in the terminal)
2. Start it again: `npm run dev`
3. The error should be gone!

## Where to Find Both Values in Supabase

In **Settings → API**, you'll see:

1. **Project URL** (top section)
   - Use for: `NEXT_PUBLIC_SUPABASE_URL`
   - Format: `https://xxxxx.supabase.co`

2. **Project API keys** (below)
   - **anon public** key (starts with `eyJ...`)
   - Use for: `NEXT_PUBLIC_SUPABASE_ANON_KEY`