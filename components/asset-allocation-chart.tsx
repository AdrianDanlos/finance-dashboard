'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts'
import type { AssetAllocation } from '@/lib/utils'

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
      className="rounded-lg border border-zinc-200 bg-white p-6 outline-none"
      style={{ outline: 'none' }}
      onMouseDown={(e) => e.preventDefault()}
    >
      <h2 className="mb-4 text-lg font-semibold text-zinc-900">Asset Allocation</h2>
      <div style={{ outline: 'none' }} className="outline-none [&_svg]:outline-none [&_svg]:focus:outline-none **:outline-none">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry: any) => 
                `${entry.assetType}: ${formatCompactAmount(entry.value)} (${entry.percentage.toFixed(1)}%)`
              }
              outerRadius={100}
              innerRadius={50}
              fill="#8884d8"
              dataKey="value"
              isAnimationActive={true}
              activeShape={false}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend
              wrapperStyle={{ paddingTop: '20px', outline: 'none' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
