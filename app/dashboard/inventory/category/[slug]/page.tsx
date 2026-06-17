import { createClient } from '../../../../../lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { InventoryTable } from '../../../../../components/features/InventoryTable'

export const dynamic = 'force-dynamic'

export default async function GameCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  // 1. Fetch game details
  const { data: game, error: gameError } = await supabase
    .from('games')
    .select('id, name')
    .eq('slug', slug)
    .single()

  if (gameError || !game) {
    redirect('/dashboard/inventory')
  }

  // 2. Fetch inventory for this game
  const { data: inventory, error: invError } = await supabase
    .from('inventory')
    .select(`
      *,
      games (
        name,
        slug
      )
    `)
    .eq('game_id', game.id)
    .order('created_at', { ascending: false })

  const items = inventory || []

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Top Bar */}
      <div>
        <Link
          href="/dashboard/inventory"
          className="inline-flex items-center space-x-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali</span>
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Stok Akun: {game.name}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Menampilkan {items.length} akun jualan untuk game ini.
          </p>
        </div>
      </div>

      {/* Error state */}
      {invError && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-600 rounded-[10px] text-sm">
          Failed to load inventory: {invError.message}
        </div>
      )}

      {/* Content */}
      <section>
        <InventoryTable inventory={items} />
      </section>
    </div>
  )
}
