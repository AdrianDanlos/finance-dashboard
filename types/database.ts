export interface AssetEntry {
  id: string
  platform: string
  asset_type: string
  amount: number
  created_at: string
}

export interface AssetEntryInsert {
  platform: string
  asset_type: string
  amount: number
}

export interface AssetEntryUpdate {
  platform?: string
  asset_type?: string
  amount?: number
}