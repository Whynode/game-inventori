import { createClient } from '../../../lib/supabase/server'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { InventoryTable } from '../../../components/features/InventoryTable'
import { ExportButton } from '../../../components/features/ExportButton'
import { GameCategoryGrid } from '../../../components/features/GameCategoryGrid'

export const dynamic = 'force-dynamic'

export default async function InventoryPage() {
 const supabase = await createClient()

 // Fetch all inventory with game info
 const { data: inventory, error } = await supabase
 .from('inventory')
 .select(`
 *,
 games (
 name,
 slug
 )
 `)
 .order('created_at', { ascending: false })

 // Fetch all games for category cards
 const { data: games } = await supabase
 .from('games')
 .select('id, name, slug')
 .order('name', { ascending: true })

 // Split inventory into active vs sold
 const allItems = inventory || []
 const activeItems = allItems.filter(
 (item: any) => item.status === 'UNPOSTED' || item.status === 'AVAILABLE'
 )
 const soldItems = allItems.filter((item: any) => item.status === 'SOLD')

 // Count active items per game
 const gameCounts: Record<string, number> = {}
 activeItems.forEach((item: any) => {
 const gameName = item.games?.name || 'Unknown'
 gameCounts[gameName] = (gameCounts[gameName] || 0) + 1
 })

 // Build category data
 const categories = (games || []).map((game: any) => ({
 id: game.id,
 name: game.name,
 slug: game.slug,
 activeCount: gameCounts[game.name] || 0,
 }))

 return (
 <div className="max-w-7xl mx-auto space-y-8">
 {/* Header */}
 <div className="flex items-center justify-between">
 <div>
 <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
 Inventory Hub
 </h1>
 <p className="text-sm text-slate-500 mt-1">
 Kelola semua stok akun jualanmu di satu tempat.
 </p>
 </div>
 <div className="flex items-center space-x-3">
 <ExportButton data={allItems} />
 <Link
 href="/dashboard/inventory/new"
 className="inline-flex items-center space-x-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all"
 >
 <Plus className="h-4 w-4" strokeWidth={2} />
 <span>Tambah Akun Baru</span>
 </Link>
 </div>
 </div>

 {/* Error state */}
 {error && (
 <div className="p-4 bg-rose-50 border border-rose-200 text-rose-600 rounded-lg text-sm">
 Failed to load inventory: {error.message}
 </div>
 )}

 {/* Section 1: Recent Active Inventory */}
 <section className="space-y-4">
 <div className="flex items-center justify-between">
 <div>
 <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
 Stok Aktif Terbaru
 </h2>
 <p className="text-xs text-slate-400 mt-0.5">
 {activeItems.length} account{activeItems.length !== 1 ? 's' : ''} currently active
 </p>
 </div>
 </div>
 <InventoryTable inventory={activeItems} />
 </section>

 {/* Section 2: Sold Archive */}
 <section className="space-y-4">
 <div className="flex items-center justify-between">
 <div>
 <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
 Riwayat Terjual
 </h2>
 <p className="text-xs text-slate-400 mt-0.5">
 {soldItems.length} account{soldItems.length !== 1 ? 's' : ''} sold
 </p>
 </div>
 </div>
 <InventoryTable inventory={soldItems} hideActions />
 </section>

 {/* Section 3: Game Categories */}
 {categories.length > 0 && (
 <section className="space-y-4">
 <div>
 <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
 Kategori Game
 </h2>
 <p className="text-xs text-slate-400 mt-0.5">
 Browse inventory by game
 </p>
 </div>
 <GameCategoryGrid categories={categories} />
 </section>
 )}
 </div>
 )
}
