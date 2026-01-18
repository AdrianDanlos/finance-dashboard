'use client'

import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import type { AssetAllocation } from '@/lib/utils'
import { formatCurrency } from '@/lib/utils'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

interface AssetAllocationChartProps {
  data: AssetAllocation[]
}

// Format amount in compact form (e.g., 40000 -> "40k")
function formatCompactAmount(amount: number): string {
  if (amount >= 1000000) {
    return `€${(amount / 1000000).toFixed(1)}M`
  } else if (amount >= 1000) {
    return `€${(amount / 1000).toFixed(0)}k`
  }
  return `€${amount.toFixed(0)}`
}

export default function AssetAllocationChart({ data }: AssetAllocationChartProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const chartData = data.map((item) => {
    const assetTypeName = item.asset_type.replace('_', ' ')
    const platformsText = item.platforms.length > 0 ? ` (${item.platforms.join(', ')})` : ''
    return {
      name: `${assetTypeName}${platformsText}`,
      value: item.total,
      percentage: item.percentage,
      assetType: assetTypeName,
      platforms: item.platforms,
    }
  })

  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-zinc-200 bg-white">
        <p className="text-sm text-zinc-500">No data available</p>
      </div>
    )
  }

  return (
    <div 
      className="rounded-lg border border-zinc-200 bg-white p-5 sm:p-6 outline-none"
      style={{ outline: 'none' }}
      onMouseDown={(e) => e.preventDefault()}
    >
      <h2 className="mb-5 sm:mb-4 text-lg font-semibold text-zinc-900">Asset Allocation</h2>
      
      {/* Flex container for chart and cards side-by-side on desktop */}
      <div className="flex flex-col sm:flex-row sm:gap-6">
        {/* Chart - smaller on mobile, labels hidden on mobile */}
        <div style={{ outline: 'none' }} className="outline-none [&_svg]:outline-none [&_svg]:focus:outline-none **:outline-none py-2 sm:py-0 sm:flex-1">
          <ResponsiveContainer width="100%" height={isMobile ? 200 : 350}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                label={isMobile ? false : (entry: any) => 
                  `${entry.assetType}: ${formatCompactAmount(entry.value)} (${entry.percentage.toFixed(1)}%)`
                }
                outerRadius={isMobile ? 60 : 100}
                innerRadius={isMobile ? 30 : 50}
                fill="#8884d8"
                dataKey="value"
                isAnimationActive={true}
                activeShape={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Cards list view - shown on mobile below, on desktop on the right */}
        <div className="mt-6 sm:mt-0 sm:w-80 space-y-3">
          {chartData.map((entry, index) => (
            <div key={index} className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 p-3">
              <div className="flex items-center gap-3">
                <div 
                  className="h-4 w-4 rounded-full shrink-0" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-zinc-900 truncate">{entry.assetType}</p>
                  {entry.platforms.length > 0 && (
                    <p className="text-xs text-zinc-600 truncate">{entry.platforms.join(', ')}</p>
                  )}
                </div>
              </div>
              <div className="text-right shrink-0 ml-2">
                <p className="text-sm font-semibold text-zinc-900">{formatCurrency(entry.value)}</p>
                <p className="text-xs text-zinc-600">{entry.percentage.toFixed(1)}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
