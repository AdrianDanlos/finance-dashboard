import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { isAllowedEmail } from '@/lib/auth'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Check if email is allowlisted
      const email = data.user.email
      if (!email || !(await isAllowedEmail(email))) {
        // Sign out unauthorized user
        await supabase.auth.signOut()
        return NextResponse.redirect(`${origin}/auth?error=unauthorized`)
      }

      // Redirect to the requested page or home
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth?error=auth_failed`)
}