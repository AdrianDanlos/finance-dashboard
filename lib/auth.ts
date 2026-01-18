import { createClient } from '@/lib/supabase/server'

const ALLOWED_EMAIL = process.env.ALLOWED_EMAIL!

export async function isAllowedEmail(email: string): Promise<boolean> {
  return email === ALLOWED_EMAIL
}

export async function getCurrentUser() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  // Verify the user's email is allowlisted
  if (!(await isAllowedEmail(user.email!))) {
    // Sign out the unauthorized user
    await supabase.auth.signOut()
    return null
  }

  return user
}