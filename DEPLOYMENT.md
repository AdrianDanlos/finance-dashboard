# Deployment Checklist

## Pre-Deployment Testing

Before deploying to Vercel, make sure everything works locally:

- [ ] **Test authentication**: Magic link login works
- [ ] **Test CRUD operations**: Add, edit, delete entries work
- [ ] **Test charts**: Asset allocation chart displays correctly
- [ ] **Test dark mode**: Toggle works and persists
- [ ] **Test mobile**: App works on mobile devices
- [ ] **Test validation**: Negative amounts are rejected
- [ ] **Build locally**: Run `npm run build` - should succeed without errors

## Deployment to Vercel

### 1. Push Code to GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Vercel will auto-detect Next.js

### 3. Add Environment Variables

In Vercel project settings → **Environment Variables**, add these 3 variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ALLOWED_EMAIL=your.email@example.com
```

**Important:**
- Make sure `ALLOWED_EMAIL` matches the email you'll use to log in
- Use the same values from your `.env.local` file
- Environment variables are case-sensitive

### 4. Update Supabase Redirect URL

After deployment, update your Supabase auth settings:

1. Go to Supabase Dashboard → **Authentication** → **URL Configuration**
2. Add your Vercel URL to **Redirect URLs**:
   ```
   https://your-app.vercel.app/auth/callback
   ```
3. Add your Vercel URL to **Site URL**:
   ```
   https://your-app.vercel.app
   ```

### 5. Deploy

Click **"Deploy"** and wait for the build to complete.

## Post-Deployment

After deployment:

1. **Test the live site**: Visit your Vercel URL
2. **Test authentication**: Make sure magic link login works
3. **Test all features**: Add/edit/delete entries, check charts
4. **Test on mobile**: Verify mobile responsiveness

## Troubleshooting

### "Unauthorized" error after login
- Check `ALLOWED_EMAIL` matches your login email
- Verify Supabase redirect URL is set correctly

### "Invalid supabaseUrl" error
- Double-check `NEXT_PUBLIC_SUPABASE_URL` format (must start with `https://`)

### Charts not displaying
- Check browser console for errors
- Verify data exists in database

### Build fails
- Check build logs in Vercel dashboard
- Make sure all dependencies are in `package.json`
- Run `npm run build` locally to catch errors first

## Optional: Custom Domain

1. Go to Vercel project → **Settings** → **Domains**
2. Add your custom domain
3. Follow Vercel's DNS instructions

## That's It! 🎉

Your personal finance dashboard is now live and ready to use!