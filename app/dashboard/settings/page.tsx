import { createClient } from '../../../lib/supabase/server'
import { AddGameForm } from '../../../components/features/AddGameForm'
import { Gamepad2, Settings2 } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
 const supabase = await createClient()

 // Fetch all games
 const { data: games, error } = await supabase
 .from('games')
 .select('*')
 .order('name', { ascending: true })

 return (
 <div className="max-w-5xl mx-auto space-y-8">
 {/* Header */}
 <div className="flex items-center gap-3">
 <div className="p-2.5 bg-slate-200/50 rounded-lg text-slate-700">
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

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 {/* Left Column - Forms */}
 <div className="lg:col-span-1 space-y-6">
 <AddGameForm />
 </div>

 {/* Right Column - Data/Lists */}
 <div className="lg:col-span-2 space-y-6">
 <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
 <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-200 bg-slate-50/50">
 <Gamepad2 className="h-4 w-4 text-slate-400" strokeWidth={1.5} />
 <h3 className="text-sm font-semibold text-slate-800">Daftar Kategori Game</h3>
 <span className="ml-auto inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
 {games?.length || 0} Total
 </span>
 </div>
 
 <div className="p-0">
 {error ? (
 <div className="p-6 text-sm text-rose-600 bg-rose-50/50">
 Failed to load categories: {error.message}
 </div>
 ) : games && games.length > 0 ? (
 <div className="overflow-x-auto">
 <table className="w-full text-left text-sm whitespace-nowrap">
 <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
 <tr>
 <th scope="col" className="px-6 py-3.5">Nama Game</th>
 <th scope="col" className="px-6 py-3.5">Slug</th>
 <th scope="col" className="px-6 py-3.5 text-right">Tanggal Masuk</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50 text-slate-600">
 {games.map((game: any) => (
 <tr key={game.id} className="hover:bg-slate-50/50 transition-colors">
 <td className="px-6 py-4 font-medium text-slate-900">
 {game.name}
 </td>
 <td className="px-6 py-4 font-medium text-xs text-slate-400">
 {game.slug}
 </td>
 <td className="px-6 py-4 text-right text-slate-400">
 {new Date(game.created_at).toLocaleDateString('en-GB', {
 day: 'numeric',
 month: 'short',
 year: 'numeric'
 })}
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 ) : (
 <div className="p-12 text-center text-slate-500 text-sm">
 Belum ada kategori game. Tambahkan yang pertama untuk memulai.
 </div>
 )}
 </div>
 </div>
 </div>
 </div>
 </div>
 )
}
