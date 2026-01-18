-- Create assets table
CREATE TABLE IF NOT EXISTS assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform VARCHAR(255) NOT NULL,
    asset_type VARCHAR(50) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL CHECK (amount >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_assets_created_at ON assets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_assets_asset_type ON assets(asset_type);
CREATE INDEX IF NOT EXISTS idx_assets_platform ON assets(platform);
-- Enable Row Level Security (RLS)
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
-- Create policy: Only authenticated users can read/write (since it's single-user, this is sufficient)
-- Note: You'll need to configure this based on your Supabase auth setup
-- The app will enforce the allowlisted email check in application code
CREATE POLICY "Allow authenticated users full access" ON assets FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');