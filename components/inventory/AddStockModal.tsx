'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createStock } from '@/actions/stocks'
import { uploadImage } from '@/actions/upload'
import { X, Loader2 } from 'lucide-react'
import { StockStatus } from '@/types/database'

interface AddStockModalProps {
  isOpen: boolean
  onClose: () => void
  categories: any[]
}

export function AddStockModal({ isOpen, onClose, categories }: AddStockModalProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  if (!isOpen) return null

  async function handleSubmit(formData: FormData) {
    setErrorMsg(null)
    
    startTransition(async () => {
      try {
        const imageFiles = formData.getAll('imageFiles') as File[]
        const validFiles = imageFiles.filter(f => f.size > 0)
        const uploadedUrls: string[] = []

        for (const file of validFiles) {
          const fileFormData = new FormData()
          fileFormData.append('file', file)
          const uploadResult = await uploadImage(fileFormData)
          if (uploadResult.success && uploadResult.url) {
            uploadedUrls.push(uploadResult.url)
          } else {
            setErrorMsg(uploadResult.error || 'Gagal mengupload gambar')
            return
          }
        }

        const data = {
          category: formData.get('category') as string,
          name: formData.get('name') as string,
          account_details: formData.get('account_details') as string,
          username: formData.get('username') as string,
          password: formData.get('password') as string,
          capital_price: Number(formData.get('capital_price')),
          post_price: Number(formData.get('post_price')),
          current_price: Number(formData.get('current_price')),
          status: 'AVAILABLE' as StockStatus,
          images: uploadedUrls,
        }

        const { error } = await createStock(data)
        if (error) {
          setErrorMsg(error)
        } else {
          router.refresh()
          onClose()
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Terjadi kesalahan saat menyimpan')
      }
    })
  }

  const inputClass = "w-full border border-slate-200 rounded-[10px] bg-white px-4 py-2.5 text-[15px] text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
  const labelClass = "text-sm font-medium text-slate-700"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-sm">
      <div 
        className="absolute inset-0 transition-opacity" 
        onClick={!isPending ? onClose : undefined}
      />
      
      <div className="relative h-full w-full max-w-md bg-white shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50 shrink-0">
          <h2 className="text-lg font-bold text-slate-900">Tambah Stok Baru</h2>
          <button 
            onClick={onClose}
            disabled={isPending}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-[10px] transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm font-medium rounded-[10px] border border-red-100">
              {errorMsg}
            </div>
          )}

          <form id="add-stock-form" action={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className={labelClass}>Kategori Game <span className="text-red-500">*</span></label>
                <select 
                  required 
                  name="category" 
                  defaultValue=""
                  className={`${inputClass} appearance-none`}
                >
                  <option value="" disabled>Pilih Kategori Game...</option>
                  {categories.map((cat: any) => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Kode / Nama Akun <span className="text-red-500">*</span></label>
                <input required name="name" type="text" className={inputClass} placeholder="cth. Akun Sultan V1" />
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-[10px] space-y-4 border border-slate-100">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kredensial Login</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={labelClass}>Username / Email</label>
                  <input name="username" type="text" className={inputClass} placeholder="Login ID" />
                </div>
                <div className="space-y-1.5">
                  <label className={labelClass}>Password</label>
                  <input name="password" type="text" className={inputClass} placeholder="Password" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Spesifikasi Akun</label>
                <textarea name="account_details" rows={2} className={inputClass} placeholder="cth. Login via Moonton / Google, Level 60, Mythic" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className={labelClass}>Gambar <span className="text-slate-400 font-normal text-xs ml-1">(Opsional)</span></label>
              <input 
                type="file" 
                name="imageFiles" 
                multiple 
                accept="image/*"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 transition-colors text-sm file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className={labelClass}>Harga Modal (Rp) <span className="text-red-500">*</span></label>
                <input required name="capital_price" type="number" min="1" className={`${inputClass} font-mono`} placeholder="0" />
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Harga Posting (Rp) <span className="text-red-500">*</span></label>
                <input required name="post_price" type="number" min="1" className={`${inputClass} font-mono`} placeholder="0" />
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Harga Jual (Rp) <span className="text-red-500">*</span></label>
                <input required name="current_price" type="number" min="1" className={`${inputClass} font-mono`} placeholder="0" />
              </div>
            </div>
          </form>
        </div>

        <div className="border-t border-slate-100 p-5 bg-slate-50/50 flex justify-end gap-3 shrink-0">
          <button 
            type="button" 
            onClick={onClose}
            disabled={isPending}
            className="px-5 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-[10px] transition-all"
          >
            Batal
          </button>
          <button 
            type="submit"
            form="add-stock-form"
            disabled={isPending}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-[10px] transition-all shadow-sm shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {isPending ? 'Menyimpan...' : 'Simpan Stok'}
          </button>
        </div>
      </div>
    </div>
  )
}
