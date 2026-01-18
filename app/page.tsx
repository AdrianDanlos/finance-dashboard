'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Nav from '@/components/nav'
import AssetAllocationChart from '@/components/asset-allocation-chart'
import {
  calculateAssetAllocation,
  formatCurrency,
} from '@/lib/utils'
import type { AssetEntry } from '@/types/database'
import { format } from 'date-fns'

export default function HomePage() {
  const router = useRouter()
  const [assets, setAssets] = useState<AssetEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const res = await fetch('/api/assets')
        if (res.status === 401) {
          router.push('/auth')
          return
        }
        const data = await res.json()
        setAssets(data || [])
      } catch (error) {
        console.error('Failed to fetch assets:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAssets()
  }, [router])

  const totalNetWorth = assets.reduce((sum, entry) => sum + entry.amount, 0)
  const assetAllocation = calculateAssetAllocation(assets)
  
  // Get last updated date (most recent entry's created_at)
  const lastUpdated = assets.length > 0 
    ? assets.reduce((latest, entry) => {
        const entryDate = new Date(entry.created_at)
        return entryDate > latest ? entryDate : latest
      }, new Date(assets[0].created_at))
    : null

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <Nav entryCount={0} />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-zinc-600">Loading...</p>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <Nav entryCount={assets.length} />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-zinc-900">Net Worth</h1>
          <p className="mt-2 text-4xl font-bold text-zinc-900">{formatCurrency(totalNetWorth)}</p>
          {lastUpdated && (
            <p className="mt-2 text-sm text-zinc-600">
              Last updated: {format(lastUpdated, 'MMM d, yyyy HH:mm')}
            </p>
          )}
        </div>

        <div className="max-w-2xl">
          <AssetAllocationChart data={assetAllocation} />
        </div>
      </main>
    </div>
  )
}
