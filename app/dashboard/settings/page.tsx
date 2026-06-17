import { createClient } from '../../../lib/supabase/server'
import { GameCategoryManager } from '../../../components/features/GameCategoryManager'
import { Settings2 } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const supabase = await createClient()

  // Fetch all games
  const { data: games, error } = await supabase
    .from('games')
    .select('*')
    .order('name', { ascending: true })

  return (
    <div className="max-w-5xl mx-auto space-y-4 lg:space-y-5 h-[calc(100vh-6rem)] overflow-hidden flex flex-col p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="p-2.5 bg-slate-200/50 rounded-[10px] text-slate-700">
          <Settings2 className="h-6 w-6" strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Pengaturan Sistem
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Konfigurasi akun, preferensi, dan daftar game.
          </p>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <GameCategoryManager initialGames={games || []} errorMsg={error?.message} />
      </div>
    </div>
  )
}
