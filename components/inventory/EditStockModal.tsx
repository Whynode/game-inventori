'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateStock } from '@/actions/stocks'
import { uploadImage } from '@/actions/upload'
import { X, Loader2 } from 'lucide-react'
import { Stock } from '@/types/database'

interface EditStockModalProps {
  stock: Stock
  isOpen: boolean
  onClose: () => void
  categories?: any[]
}

export function EditStockModal({ stock, isOpen, onClose, categories = [] }: EditStockModalProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [clearExisting, setClearExisting] = useState(false)

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

        const existingImages = clearExisting ? [] : (stock.images || [])
        const finalImages = [...existingImages, ...uploadedUrls]

        const data = {
          category: formData.get('category') as string,
          name: formData.get('name') as string,
          account_details: formData.get('account_details') as string,
          username: formData.get('username') as string,
          password: formData.get('password') as string,
          capital_price: Number(formData.get('capital_price')),
          post_price: Number(formData.get('post_price')),
          current_price: Number(formData.get('current_price')),
          images: finalImages,
        }

        const { error } = await updateStock(stock.id, data)
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={!isPending ? onClose : undefined}
      />
      
      <div className="relative w-full max-w-2xl bg-white rounded-[10px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-blue-50/50 shrink-0">
          <h2 className="text-lg font-bold text-slate-900">Edit Stok Akun</h2>
          <button 
            onClick={onClose}
            disabled={isPending}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-white rounded-[10px] transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm font-medium rounded-[10px] border border-red-100">
              {errorMsg}
            </div>
          )}

          <form id="edit-stock-form" action={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className={labelClass}>Kategori Game <span className="text-red-500">*</span></label>
                {categories.length > 0 ? (
                  <select 
                    required 
                    name="category" 
                    defaultValue={stock.category}
                    className={`${inputClass} appearance-none`}
                  >
                    <option value="" disabled>Pilih Kategori Game...</option>
                    {categories.map((cat: any) => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                ) : (
                  <input required name="category" defaultValue={stock.category} type="text" className={inputClass} />
                )}
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Kode / Nama Akun <span className="text-red-500">*</span></label>
                <input required name="name" defaultValue={stock.name} type="text" className={inputClass} />
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-[10px] space-y-4 border border-slate-100">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kredensial Login</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={labelClass}>Username / Email</label>
                  <input name="username" defaultValue={stock.username || ''} type="text" className={inputClass} />
                </div>
                <div className="space-y-1.5">
                  <label className={labelClass}>Password</label>
                  <input name="password" defaultValue={stock.password || ''} type="text" className={inputClass} />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Spesifikasi Akun</label>
                <textarea name="account_details" defaultValue={stock.account_details || ''} rows={2} className={inputClass} />
              </div>
            </div>

            <div className="space-y-1.5 border border-slate-200 rounded-[10px] p-4">
              <label className={labelClass}>Gambar <span className="text-slate-400 font-normal text-xs ml-1">(Opsional)</span></label>
              
              {stock.images && stock.images.length > 0 && (
                <div className="flex flex-col gap-2 my-2">
                  <div className="flex flex-wrap gap-2">
                    {stock.images.map((img, idx) => (
                      <img key={idx} src={img} alt="Current" className="w-12 h-12 rounded-lg object-cover border border-slate-200" />
                    ))}
                  </div>
                  <label className="flex items-center gap-2 mt-1 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={clearExisting} 
                      onChange={(e) => setClearExisting(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" 
                    />
                    <span className="text-sm text-red-600 font-medium">Hapus gambar lama & timpa dengan yang baru</span>
                  </label>
                </div>
              )}
              
              <input 
                type="file" 
                name="imageFiles" 
                multiple 
                accept="image/*"
                className="w-full mt-2 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 transition-colors text-sm file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="text-xs text-slate-500 mt-1">Pilih gambar baru untuk ditambahkan.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className={labelClass}>Harga Modal (Rp) <span className="text-red-500">*</span></label>
                <input required name="capital_price" defaultValue={stock.capital_price} type="number" min="1" className={`${inputClass} font-mono`} />
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Harga Posting (Rp) <span className="text-red-500">*</span></label>
                <input required name="post_price" defaultValue={stock.post_price} type="number" min="1" className={`${inputClass} font-mono`} />
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Harga Jual (Rp) <span className="text-red-500">*</span></label>
                <input required name="current_price" defaultValue={stock.current_price} type="number" min="1" className={`${inputClass} font-mono`} />
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
            form="edit-stock-form"
            disabled={isPending}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-[10px] transition-all shadow-sm shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </div>
    </div>
  )
}
