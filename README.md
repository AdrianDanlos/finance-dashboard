# Finance Dashboard

A single-user personal finance dashboard for tracking net worth. Minimal, clean, and private.

## Features

- **Magic Link Authentication** - Secure login without passwords
- **Single-User Access** - Only one allowlisted email can access the app
- **Net Worth Summary** - View total net worth at a glance
- **Asset Allocation Chart** - Donut chart showing distribution by asset type
- **Platform Allocation Chart** - Horizontal bar chart showing distribution by platform
- **Data Management** - Add, edit, and delete asset entries

## Tech Stack

- **Frontend**: React + TypeScript
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Authentication**: Supabase Auth (Magic Links)
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel-ready

## Setup

### 1. Prerequisites

- Node.js 18+ and npm
- A Supabase account and project

### 2. Supabase Setup

**📖 Detailed Setup Guide**: See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for step-by-step instructions.

**Quick Steps:**
1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema from `supabase/schema.sql`
3. Go to Authentication → Providers and enable Email authentication
4. Get your API keys from Settings → API:
   - Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - Copy **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ALLOWED_EMAIL=your.email@example.com
```

**⚠️ Important**: The `ALLOWED_EMAIL` must match the email address you'll use to log in.

### 4. Install Dependencies

```bash
npm install
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add the same environment variables in Vercel project settings
4. Deploy

## Data Model

Each asset entry contains:

- `id` - Unique identifier (UUID)
- `platform` - Platform name (e.g., "n26", "binance", "degiro")
- `asset_type` - Type of asset (any string, e.g., "cash", "crypto", "stocks", "real estate")
- `amount` - Amount in your base currency (number)
- `created_at` - Timestamp of creation

## Usage

1. **Sign In**: Use the magic link authentication with your allowlisted email
2. **View Dashboard**: The home page shows your net worth and allocation charts
3. **Manage Data**: Go to the Data page to add, edit, or delete asset entries
4. **Update**: Make changes on the Data page and see charts update automatically

## Project Structure

```
├── app/
│   ├── auth/              # Authentication pages
│   ├── api/               # API routes for CRUD operations
│   ├── data/              # Data management page
│   ├── page.tsx           # Home page with charts
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── nav.tsx            # Navigation bar
│   ├── asset-allocation-chart.tsx
│   └── platform-allocation-chart.tsx
├── lib/
│   ├── supabase/          # Supabase client utilities
│   ├── auth.ts            # Authentication helpers
│   └── utils.ts           # Utility functions
├── types/
│   └── database.ts        # TypeScript types
└── supabase/
    └── schema.sql         # Database schema
```

## Security Notes

- The app enforces single-user access through `ALLOWED_EMAIL` environment variable
- All routes are protected by authentication middleware
- Unauthorized users are automatically signed out
- Row Level Security (RLS) is enabled on the database table

## License

Private project - not for distribution.