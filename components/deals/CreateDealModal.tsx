'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createDeal } from '@/actions/deals'
import { getAvailableStocks } from '@/actions/stocks'
import { X, Loader2, FileText, CheckCircle } from 'lucide-react'
import { Stock } from '@/types/database'
import { formatRupiah } from '@/lib/utils'

interface CreateDealModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateDealModal({ isOpen, onClose }: CreateDealModalProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  
  const [stocks, setStocks] = useState<Stock[]>([])
  const [isLoadingStocks, setIsLoadingStocks] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadStocks()
    }
  }, [isOpen])

  async function loadStocks() {
    setIsLoadingStocks(true)
    const { data, error } = await getAvailableStocks()
    if (!error && data) {
      setStocks(data)
    }
    setIsLoadingStocks(false)
  }

  if (!isOpen) return null

  async function handleSubmit(formData: FormData) {
    setErrorMsg(null)
    
    const stockId = formData.get('stock_id') as string
    const customerName = formData.get('customer_name') as string
    const customerContact = formData.get('customer_contact') as string
    const dealPrice = Number(formData.get('deal_price') || 0)

    if (!stockId) {
      setErrorMsg('Pilih stok terlebih dahulu.')
      return
    }
    if (!customerName.trim()) {
      setErrorMsg('Nama customer wajib diisi.')
      return
    }
    if (dealPrice <= 0) {
      setErrorMsg('Harga deal harus lebih besar dari 0.')
      return
    }

    startTransition(async () => {
      const { data, error } = await createDeal(
        stockId,
        customerName,
        customerContact || '',
        dealPrice
      )

      if (error || !data) {
        setErrorMsg(error || 'Gagal membuat deal')
      } else {
        onClose()
        router.push(`/dashboard/deals/${data.id}`)
      }
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" 
        onClick={!isPending ? onClose : undefined}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-xl bg-white rounded-[10px] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-purple-600 text-white">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            <h2 className="text-lg font-bold">Buat Transaksi Baru (Deal)</h2>
          </div>
          <button 
            onClick={onClose}
            disabled={isPending}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-[10px] transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          {errorMsg && (
            <div className="mb-5 p-4 bg-red-50 text-red-700 text-sm font-medium rounded-[10px] border border-red-100 flex items-start">
              <span className="mr-2">⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <form id="create-deal-form" action={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Pilih Stok (Hanya Tersedia) <span className="text-red-500">*</span></label>
              {isLoadingStocks ? (
                <div className="w-full border border-gray-300 rounded-[10px] px-4 py-2.5 text-sm bg-gray-50 flex items-center gap-2 text-gray-500">
                  <Loader2 className="w-4 h-4 animate-spin" /> Memuat stok...
                </div>
              ) : (
                <select 
                  required 
                  name="stock_id" 
                  className="w-full border border-gray-300 rounded-[10px] px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all bg-white"
                  defaultValue=""
                >
                  <option value="" disabled>-- Pilih Stok --</option>
                  {stocks.map(stock => (
                    <option key={stock.id} value={stock.id}>
                      {stock.name || stock.category} • Modal: {formatRupiah(stock.capital_price)}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Nama Customer <span className="text-red-500">*</span></label>
              <input required name="customer_name" type="text" className="w-full border border-gray-300 rounded-[10px] px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all placeholder:text-gray-400" placeholder="e.g. Budi Santoso" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Kontak Customer (Optional)</label>
              <input name="customer_contact" type="text" className="w-full border border-gray-300 rounded-[10px] px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all placeholder:text-gray-400" placeholder="e.g. 08123456789 / @budi_ig" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Harga Deal (Harga Jual Akhir) <span className="text-red-500">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-sm font-medium">Rp</span>
                </div>
                <input required name="deal_price" type="number" min="1" className="w-full border border-gray-300 rounded-[10px] pl-12 pr-4 py-2.5 text-sm font-mono focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all" placeholder="0" />
              </div>
              <p className="text-xs text-gray-500">Harga final yang disepakati dengan customer.</p>
            </div>
          </form>
        </div>

        <div className="border-t border-gray-100 p-6 bg-gray-50 flex justify-end gap-3 rounded-[10px]">
          <button 
            type="button" 
            onClick={onClose}
            disabled={isPending}
            className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-[10px] transition-all shadow-sm"
          >
            Batal
          </button>
          <button 
            type="submit"
            form="create-deal-form"
            disabled={isPending}
            className="px-6 py-2.5 text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 active:bg-purple-800 rounded-[10px] transition-all shadow-sm shadow-purple-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {isPending ? 'Menyimpan...' : 'Buat Transaksi'}
          </button>
        </div>
      </div>
    </div>
  )
}
