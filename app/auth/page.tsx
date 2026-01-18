'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const supabase = createClient()

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setMessage(error.message)
      setLoading(false)
    } else {
      setMessage('Check your email for the magic link!')
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-6 sm:p-8 shadow-sm">
        <h1 className="mb-6 text-2xl font-semibold text-zinc-900">Sign In</h1>
        <p className="mb-6 text-sm text-zinc-600">
          Enter your email to receive a magic link for authentication.
        </p>
        <form onSubmit={handleMagicLink} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-md border border-zinc-300 px-3 py-2.5 sm:py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              placeholder="your@email.com"
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-zinc-900 px-4 py-2.5 sm:py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 transition-colors touch-manipulation"
          >
            {loading ? 'Sending...' : 'Send Magic Link'}
          </button>
        </form>
        {message && (
          <p className={`mt-4 text-sm ${message.includes('Check') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  )
}
