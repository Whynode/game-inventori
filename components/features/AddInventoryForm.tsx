'use client'

import { useState, useTransition, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { addInventoryItem } from '@/actions/inventory'
import { Loader2, UploadCloud, ChevronDown, Check, X } from 'lucide-react'

type Game = {
  id: string
  name: string
}

export function AddInventoryForm({ games }: { games: Game[] }) {
  const [error, setError] = useState<string | null>(null)
  const [images, setImages] = useState<File[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedGameId, setSelectedGameId] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    
    if (!selectedGameId) {
      setError("Please select a game category.")
      return
    }

    if (images.length === 0) {
      setError("Please upload at least one screenshot.")
      return
    }

    images.forEach(img => {
      formData.append('images', img)
    })

    startTransition(async () => {
      const result = await addInventoryItem(formData)
      if (result.success) {
        router.push('/dashboard/inventory')
      } else {
        setError(result.error || 'Terjadi kesalahan tidak terduga.')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 text-sm text-rose-600 bg-rose-50 rounded-[10px] ring-1 ring-rose-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1 relative" ref={dropdownRef}>
          <label className="block text-sm font-medium text-slate-700">
            Pilih Kategori Game
          </label>
          <input type="hidden" name="game_id" value={selectedGameId} required />
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-[10px] flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 transition-colors hover:bg-slate-100"
          >
            <span className={selectedGameId ? "text-slate-900" : "text-slate-500"}>
              {selectedGameId ? games.find(g => g.id === selectedGameId)?.name : "Select a game..."}
            </span>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>
          
          {isOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-[10px] py-1 max-h-60 overflow-auto">
              {games.map(game => (
                <button
                  key={game.id}
                  type="button"
                  onClick={() => {
                    setSelectedGameId(game.id)
                    setIsOpen(false)
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between transition-colors"
                >
                  {game.name}
                  {selectedGameId === game.id && <Check className="h-4 w-4 text-blue-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700" htmlFor="title_reference">
            Kode Unik Akun
          </label>
          <input
            id="title_reference"
            name="title_reference"
            type="text"
            required
            placeholder="e.g. ML-MYTHIC-001"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 transition-colors"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700">
          Upload Screenshot Akun (Max 20)
        </label>
        
        {images.length > 0 && (
          <div className="grid grid-cols-4 md:grid-cols-5 gap-3 mb-4">
            {images.map((img, idx) => (
              <div key={idx} className="relative aspect-square rounded-[10px] border border-slate-200 overflow-hidden bg-slate-50 group">
                <img src={URL.createObjectURL(img)} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImages(prev => prev.filter((_, i) => i !== idx))}
                  className="absolute top-1 right-1 bg-white/90 text-slate-700 p-1 rounded-[10px] opacity-0 group-hover:opacity-100 transition-opacity hover:text-rose-600 hover:bg-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {images.length < 20 && (
          <div className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-slate-200 border-dashed rounded-[10px] bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer overflow-hidden group">
            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-500">
              <UploadCloud className="w-8 h-8 mb-3 text-slate-400 group-hover:text-blue-500 transition-colors" />
              <p className="mb-2 text-sm"><span className="font-semibold text-blue-600">Klik untuk upload</span> atau seret file ke sini</p>
              <p className="text-xs">PNG, JPG or WEBP (MAX. 5MB) - {20 - images.length} slot tersisa</p>
            </div>
            <input 
              id="screenshot" 
              type="file" 
              accept="image/*"
              multiple
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={(e) => {
                const files = Array.from(e.target.files || [])
                if (images.length + files.length > 20) {
                  alert('Maksimal 20 gambar yang diperbolehkan.')
                  return
                }
                setImages(prev => [...prev, ...files])
                e.target.value = ''
              }}
            />
          </div>
        )}
      </div>

 <div className="space-y-1">
 <label className="block text-sm font-medium text-slate-700" htmlFor="account_specs">
 Spesifikasi Akun (Rank, Skin, Winrate...)
 </label>
 <textarea
 id="account_specs"
 name="account_specs"
 required
 rows={4}
 placeholder="Details like rank, skins, win rate..."
 className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 transition-colors"
 />
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div className="space-y-1">
 <label className="block text-sm font-medium text-slate-700" htmlFor="capital_price">
 Harga Modal (Rp)
 </label>
 <input
 id="capital_price"
 name="capital_price"
 type="number"
 min="0"
 required
 placeholder="e.g. 500000"
 className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 transition-colors"
 />
 </div>

 <div className="space-y-1">
 <label className="block text-sm font-medium text-slate-700" htmlFor="asking_price">
 Target Jual
 </label>
 <input
 id="asking_price"
 name="asking_price"
 type="number"
 min="0"
 required
 placeholder="e.g. 750000"
 className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 transition-colors"
 />
 </div>
 </div>

 <div className="pt-4 flex justify-end">
 <button
 type="submit"
 disabled={isPending}
 className="inline-flex items-center justify-center px-6 py-2.5 bg-blue-600 text-white font-medium rounded-[10px] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
 >
 {isPending ? (
 <>
 <Loader2 className="animate-spin h-4 w-4 mr-2" />
 Menyimpan...
 </>
 ) : (
 'Simpan Data Akun'
 )}
 </button>
 </div>
 </form>
 )
}
