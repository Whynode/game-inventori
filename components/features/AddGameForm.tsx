'use client'

import { useState, useTransition } from 'react'
import { addGameCategory } from '@/actions/settings'
import { Loader2, Plus, Check } from 'lucide-react'

export function AddGameForm() {
 const [name, setName] = useState('')
 const [slug, setSlug] = useState('')
 const [error, setError] = useState<string | null>(null)
 const [success, setSuccess] = useState(false)
 const [isPending, startTransition] = useTransition()

 const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 const newName = e.target.value
 setName(newName)
 // Auto-generate slug: lowercase, replace spaces and non-alphanumeric with hyphens
 setSlug(newName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
 }

 const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
 e.preventDefault()
 setError(null)
 setSuccess(false)

 startTransition(async () => {
 const result = await addGameCategory(name, slug)
 if (result.success) {
 setSuccess(true)
 setName('')
 setSlug('')
 setTimeout(() => setSuccess(false), 3000)
 } else {
 setError(result.error || 'An unexpected error occurred.')
 }
 })
 }

 return (
 <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
 <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
 <h3 className="text-sm font-semibold text-slate-800">Tambah Kategori Game</h3>
 </div>
 <div className="p-6">
 <form onSubmit={handleSubmit} className="space-y-4">
 {error && (
 <div className="p-3 text-sm text-rose-600 bg-rose-50 rounded-lg ring-1 ring-rose-200">
 {error}
 </div>
 )}
 {success && (
 <div className="p-3 text-sm text-emerald-700 bg-emerald-50 rounded-lg ring-1 ring-emerald-200 flex items-center gap-2">
 <Check className="h-4 w-4" /> Kategori game berhasil ditambahkan!
 </div>
 )}

 <div className="space-y-1.5">
 <label className="block text-sm font-medium text-slate-700" htmlFor="name">
 Nama Game
 </label>
 <input
 id="name"
 type="text"
 required
 value={name}
 onChange={handleNameChange}
 placeholder="e.g. Apex Legends"
 className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 transition-colors text-sm"
 />
 </div>

 <div className="space-y-1.5">
 <label className="block text-sm font-medium text-slate-700" htmlFor="slug">
 Slug (Otomatis)
 </label>
 <input
 id="slug"
 type="text"
 required
 value={slug}
 onChange={(e) => setSlug(e.target.value)}
 placeholder="e.g. apex-legends"
 className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 transition-colors text-sm"
 />
 </div>

 <div className="pt-2">
 <button
 type="submit"
 disabled={isPending || !name || !slug}
 className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
 >
 {isPending ? (
 <>
 <Loader2 className="animate-spin h-4 w-4" />
 <span>Menambahkan...</span>
 </>
 ) : (
 <>
 <Plus className="h-4 w-4" strokeWidth={2.5} />
 <span>Tambah Kategori</span>
 </>
 )}
 </button>
 </div>
 </form>
 </div>
 </div>
 )
}
