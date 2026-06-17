'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createAccount } from '@/actions/accounts'
import { X, Loader2, CreditCard } from 'lucide-react'

interface AddAccountModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddAccountModal({ isOpen, onClose }: AddAccountModalProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  if (!isOpen) return null

  async function handleSubmit(formData: FormData) {
    setErrorMsg(null)
    
    const name = formData.get('name') as string
    const accountNumber = formData.get('account_number') as string
    const balance = Number(formData.get('balance') || 0)

    if (!name.trim()) {
      setErrorMsg('Nama rekening wajib diisi.')
      return
    }

    startTransition(async () => {
      const { error } = await createAccount({
        name,
        account_number: accountNumber || null,
        balance,
        is_active: true
      })

      if (error) {
        setErrorMsg(error)
      } else {
        router.refresh()
        onClose()
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
      <div className="relative w-full max-w-lg bg-white rounded-[10px] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-blue-600 text-white">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            <h2 className="text-lg font-bold">Tambah Rekening Baru</h2>
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

          <form id="add-account-form" action={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Nama Rekening/Metode <span className="text-red-500">*</span></label>
              <input required name="name" type="text" className="w-full border border-gray-300 rounded-[10px] px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400" placeholder="e.g. Bank Mandiri Fery" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Nomor Rekening / No. HP (Optional)</label>
              <input name="account_number" type="text" className="w-full border border-gray-300 rounded-[10px] px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400" placeholder="e.g. 1420017110600 or 0812345678" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Saldo Awal (Rp)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-sm font-medium">Rp</span>
                </div>
                <input name="balance" type="number" defaultValue="0" min="0" className="w-full border border-gray-300 rounded-[10px] pl-12 pr-4 py-2.5 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
              </div>
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
            form="add-account-form"
            disabled={isPending}
            className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-[10px] transition-all shadow-sm shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {isPending ? 'Menyimpan...' : 'Tambah Rekening'}
          </button>
        </div>
      </div>
    </div>
  )
}
