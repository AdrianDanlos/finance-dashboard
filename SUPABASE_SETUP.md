# Supabase Setup Guide

Follow these steps to set up Supabase for your finance dashboard.

## Step 1: Create a Supabase Account and Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"Sign Up"**
3. Sign up with GitHub, Google, or email
4. Once logged in, click **"New Project"**
5. Fill in the project details:
   - **Name**: finance-dashboard (or any name you like)
   - **Database Password**: Choose a strong password (save this somewhere!)
   - **Region**: Choose closest to you
   - **Pricing Plan**: Free tier is fine
6. Click **"Create new project"**
7. Wait 2-3 minutes for the project to initialize

## Step 2: Create the Database Table

1. In your Supabase project dashboard, go to **SQL Editor** (in the left sidebar)
2. Click **"New query"**
3. Open the file `supabase/schema.sql` from this project
4. Copy the entire contents of `schema.sql`
5. Paste it into the SQL Editor in Supabase
6. Click **"Run"** (or press `Ctrl+Enter`)
7. You should see a success message: "Success. No rows returned"

## Step 3: Get Your API Keys

1. In Supabase dashboard, go to **Settings** (gear icon in left sidebar)
2. Click **"API"** under Project Settings
3. You'll see two important values:

   **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - Copy this - you'll need it as `NEXT_PUBLIC_SUPABASE_URL`

   **Project API keys**
   - Find the **`anon` `public`** key (the one that starts with `eyJ...`)
   - Copy this - you'll need it as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - ⚠️ This is safe to expose in client-side code (it's public)

## Step 4: Configure Email Authentication

1. In Supabase dashboard, go to **Authentication** (left sidebar)
2. Click **"Providers"** 
3. Find **"Email"** in the list
4. Make sure it's **Enabled** (toggle should be ON)
5. Under **"Email Auth"**, you can customize:
   - **Confirm email**: You can disable this for easier testing (turn OFF)
   - Leave other settings as default

## Step 5: Set Up Environment Variables Locally

1. In your project root folder (`finance-dashboard`), create a file named `.env.local`
   - If you're using VS Code: Right-click → New File → `.env.local`

2. Add these three lines (replace with YOUR values from Step 3):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
ALLOWED_EMAIL=your.email@example.com
```

**Example:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxODk2MDAsImV4cCI6MTk2MDc2NTYwMH0.example_key_here
ALLOWED_EMAIL=john@example.com
```

3. **Important**: Replace `your.email@example.com` with YOUR actual email address (the one you want to use to log in)

## Step 6: Test Your Setup

1. Make sure your `.env.local` file is saved
2. Restart your development server:
   ```bash
   # Stop the server (Ctrl+C if running)
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000)
4. You should be redirected to `/auth`
5. Enter your email (the one you set in `ALLOWED_EMAIL`)
6. Click **"Send Magic Link"**
7. Check your email inbox for the magic link
8. Click the link in the email
9. You should be logged in and redirected to the dashboard!

## Step 7: Deploy to Vercel (When Ready)

When you're ready to deploy:

1. Push your code to GitHub
2. Go to [https://vercel.com](https://vercel.com)
3. Click **"Add New Project"** → Import your GitHub repository
4. In Vercel's project settings, go to **"Environment Variables"**
5. Add the same three variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = (your Supabase URL)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (your Supabase anon key)
   - `ALLOWED_EMAIL` = (your email address)
6. Click **"Deploy"**

## Troubleshooting

### "Invalid API key" error
- Double-check you copied the `anon` `public` key (not the `service_role` key)
- Make sure there are no extra spaces in `.env.local`

### "Email not authorized" / Can't log in
- Verify `ALLOWED_EMAIL` in `.env.local` matches the email you're using
- Make sure you restarted the dev server after adding `.env.local`

### "Table 'assets' does not exist"
- Go back to SQL Editor in Supabase
- Re-run the `schema.sql` file
- Check if the table was created: Go to **Table Editor** → you should see `assets` table

### Magic link not arriving
- Check spam folder
- In Supabase: Authentication → Email Templates → you can customize the email
- Try disabling "Confirm email" in Email provider settings for easier testing

### Database connection issues
- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct (should start with `https://`)
- Check your Supabase project is not paused (free tier pauses after inactivity)

## Quick Checklist

- [ ] Created Supabase project
- [ ] Ran `schema.sql` in SQL Editor
- [ ] Copied Project URL and anon key
- [ ] Enabled Email authentication
- [ ] Created `.env.local` with correct values
- [ ] Set `ALLOWED_EMAIL` to your email
- [ ] Restarted dev server
- [ ] Tested login with magic link

## Need Help?

- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- Check the Supabase dashboard logs: **Logs** → **Auth Logs** or **Postgres Logs**