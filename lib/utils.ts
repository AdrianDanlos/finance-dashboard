import type { AssetEntry } from '@/types/database'

export interface AssetAllocation {
  asset_type: string
  total: number
  percentage: number
  platforms: string[]
}

export interface PlatformAllocation {
  platform: string
  total: number
  percentage: number
}

export function calculateAssetAllocation(entries: AssetEntry[]): AssetAllocation[] {
  const grandTotal = entries.reduce((sum, entry) => sum + entry.amount, 0)
  const grouped = entries.reduce((acc, entry) => {
    const key = entry.asset_type
    if (!acc[key]) {
      acc[key] = { total: 0, platforms: new Set<string>() }
    }
    acc[key].total += entry.amount
    acc[key].platforms.add(entry.platform)
    return acc
  }, {} as Record<string, { total: number; platforms: Set<string> }>)

  return Object.entries(grouped)
    .map(([asset_type, data]) => ({
      asset_type,
      total: data.total,
      percentage: grandTotal > 0 ? (data.total / grandTotal) * 100 : 0,
      platforms: Array.from(data.platforms),
    }))
    .sort((a, b) => b.total - a.total)
}

export function calculatePlatformAllocation(entries: AssetEntry[]): PlatformAllocation[] {
  const grandTotal = entries.reduce((sum, entry) => sum + entry.amount, 0)
  const grouped = entries.reduce((acc, entry) => {
    const key = entry.platform
    acc[key] = (acc[key] || 0) + entry.amount
    return acc
  }, {} as Record<string, number>)

  return Object.entries(grouped)
    .map(([platform, total]) => ({
      platform,
      total,
      percentage: grandTotal > 0 ? (total / grandTotal) * 100 : 0,
    }))
    .sort((a, b) => b.total - a.total)
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`
}