'use client'

import { useEffect, useState, useRef } from 'react'
import Nav from '@/components/nav'
import { formatCurrency } from '@/lib/utils'
import type { AssetEntry } from '@/types/database'
import { format } from 'date-fns'

export default function DataPage() {
  const [entries, setEntries] = useState<AssetEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    platform: '',
    asset_type: '',
    amount: '',
  })
  const [error, setError] = useState<string | null>(null)
  const platformInputRef = useRef<HTMLInputElement>(null)

  const fetchEntries = async () => {
    try {
      const res = await fetch('/api/assets')
      const data = await res.json()
      setEntries(data)
    } catch (error) {
      console.error('Failed to fetch entries:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEntries()
  }, [])

  // Auto-focus first input when adding new entry
  useEffect(() => {
    if (!editingId && platformInputRef.current) {
      platformInputRef.current.focus()
    }
  }, [editingId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    const amount = parseFloat(formData.amount)
    if (isNaN(amount) || amount < 0) {
      setError('Amount must be a positive number')
      return
    }

    const payload = {
      ...formData,
      amount,
    }

    try {
      const response = editingId
        ? await fetch(`/api/assets/${editingId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
        : await fetch('/api/assets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })

      if (!response.ok) {
        throw new Error('Failed to save entry')
      }

      // Clear form on successful submit
      setFormData({ platform: '', asset_type: '', amount: '' })
      setEditingId(null)
      setError(null)
      fetchEntries()
      
      // Re-focus first input after successful add
      if (!editingId && platformInputRef.current) {
        setTimeout(() => platformInputRef.current?.focus(), 100)
      }
    } catch (error) {
      console.error('Failed to save entry:', error)
      setError('Failed to save entry. Please try again.')
    }
  }

  const handleEdit = (entry: AssetEntry) => {
    setEditingId(entry.id)
    setFormData({
      platform: entry.platform,
      asset_type: entry.asset_type,
      amount: entry.amount.toString(),
    })
    setError(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this entry?')) return

    try {
      await fetch(`/api/assets/${id}`, { method: 'DELETE' })
      fetchEntries()
    } catch (error) {
      console.error('Failed to delete entry:', error)
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setFormData({ platform: '', asset_type: '', amount: '' })
    setError(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
        <Nav entryCount={0} />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <Nav entryCount={entries.length} />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">Data Management</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Manage your asset entries</p>
        </div>

        <div className="mb-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 sm:p-6">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            {editingId ? 'Edit Entry' : 'Add New Entry'}
          </h2>
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-4">
            <div>
              <label htmlFor="platform" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Platform
              </label>
              <input
                ref={platformInputRef}
                id="platform"
                type="text"
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                required
                className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 px-3 py-2.5 sm:py-2 text-sm focus:border-zinc-500 dark:focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:focus:ring-zinc-600"
                placeholder="e.g., n26, binance"
              />
            </div>
            <div>
              <label htmlFor="asset_type" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Asset Type
              </label>
              <input
                id="asset_type"
                type="text"
                value={formData.asset_type}
                onChange={(e) => setFormData({ ...formData, asset_type: e.target.value })}
                required
                className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 px-3 py-2.5 sm:py-2 text-sm focus:border-zinc-500 dark:focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:focus:ring-zinc-600"
                placeholder="e.g., cash, crypto, stocks"
              />
            </div>
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Amount
              </label>
              <input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => {
                  const value = e.target.value
                  setFormData({ ...formData, amount: value })
                  setError(null)
                }}
                required
                className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 px-3 py-2.5 sm:py-2 text-sm focus:border-zinc-500 dark:focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:focus:ring-zinc-600"
                placeholder="0.00"
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="w-full rounded-md bg-zinc-900 dark:bg-zinc-50 px-4 py-2.5 sm:py-2 text-sm font-medium text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors touch-manipulation"
              >
                {editingId ? 'Update' : 'Add'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 px-4 py-2.5 sm:py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors touch-manipulation"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
          {error && (
            <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
        </div>

        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                    Platform
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                    Asset Type
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                    Amount
                  </th>
                  <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                    Created
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-950">
                {entries.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 sm:px-6 py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                      No entries yet. Add your first entry above.
                    </td>
                  </tr>
                ) : (
                  entries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                      <td className="whitespace-nowrap px-4 sm:px-6 py-4 text-sm text-zinc-900 dark:text-zinc-50">
                        {entry.platform}
                      </td>
                      <td className="whitespace-nowrap px-4 sm:px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                        {entry.asset_type}
                      </td>
                      <td className="whitespace-nowrap px-4 sm:px-6 py-4 text-sm font-medium text-zinc-900 dark:text-zinc-50">
                        {formatCurrency(entry.amount)}
                      </td>
                      <td className="hidden sm:table-cell whitespace-nowrap px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                        {format(new Date(entry.created_at), 'MMM d, yyyy')}
                      </td>
                      <td className="whitespace-nowrap px-4 sm:px-6 py-4 text-right text-sm font-medium">
                        <div className="flex justify-end gap-2 sm:gap-3">
                          <button
                            onClick={() => handleEdit(entry)}
                            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors touch-manipulation min-h-[44px] min-w-[44px] px-2 sm:px-0"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(entry.id)}
                            className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors touch-manipulation min-h-[44px] min-w-[44px] px-2 sm:px-0"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
