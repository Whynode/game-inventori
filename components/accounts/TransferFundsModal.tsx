'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { transferFunds } from '@/actions/accounts'
import { formatRupiah } from '@/lib/utils'
import { X, Loader2, ArrowRightLeft } from 'lucide-react'
import { Account } from '@/types/database'

interface TransferFundsModalProps {
  isOpen: boolean
  onClose: () => void
  accounts: Account[]
}

export function TransferFundsModal({ isOpen, onClose, accounts }: TransferFundsModalProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const [sourceId, setSourceId] = useState('')
  const [destId, setDestId] = useState('')
  const [amount, setAmount] = useState(0)
  const [adminFee, setAdminFee] = useState(0)

  const selectedSource = accounts.find(a => a.id === sourceId)
  const sourceBalance = selectedSource?.balance || 0
  const totalDeduction = amount + adminFee

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSourceId('')
      setDestId('')
      setAmount(0)
      setAdminFee(0)
      setErrorMsg(null)
    }
  }, [isOpen])

  if (!isOpen) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg(null)

    if (!sourceId || !destId) {
      setErrorMsg('Harap pilih rekening asal dan tujuan.')
      return
    }

    if (sourceId === destId) {
      setErrorMsg('Rekening asal dan tujuan tidak boleh sama.')
      return
    }

    if (amount <= 0) {
      setErrorMsg('Nominal transfer harus lebih besar dari Rp 0.')
      return
    }

    if (adminFee < 0) {
      setErrorMsg('Biaya admin tidak boleh kurang dari Rp 0.')
      return
    }

    if (sourceBalance < totalDeduction) {
      setErrorMsg(`Saldo rekening asal tidak mencukupi. (Saldo: ${formatRupiah(sourceBalance)}, Dibutuhkan: ${formatRupiah(totalDeduction)})`)
      return
    }

    startTransition(async () => {
      const { success, error } = await transferFunds(sourceId, destId, amount, adminFee)
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
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-indigo-600 text-white">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5" />
            <h2 className="text-lg font-bold">Mutasi Saldo (Transfer Internal)</h2>
          </div>
          <button 
            onClick={onClose}
            disabled={isPending}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-[10px] transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
            {errorMsg && (
              <div className="p-4 bg-red-50 text-red-700 text-sm font-medium rounded-[10px] border border-red-100 flex items-start">
                <span className="mr-2">⚠️</span>
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Source Account */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Rekening Asal <span className="text-red-500">*</span></label>
              <select 
                required 
                value={sourceId}
                onChange={(e) => setSourceId(e.target.value)}
                className="w-full border border-gray-300 rounded-[10px] px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
              >
                <option value="">-- Pilih Rekening Asal --</option>
                {accounts
                  .filter(acc => acc.is_active)
                  .map(acc => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} (Saldo: {formatRupiah(acc.balance)})
                    </option>
                  ))
                }
              </select>
              {selectedSource && (
                <div className="text-xs text-gray-500 flex justify-between px-1">
                  <span>Saldo Tersedia:</span>
                  <span className="font-semibold text-gray-700">{formatRupiah(sourceBalance)}</span>
                </div>
              )}
            </div>

            {/* Destination Account */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Rekening Tujuan <span className="text-red-500">*</span></label>
              <select 
                required 
                value={destId}
                onChange={(e) => setDestId(e.target.value)}
                className="w-full border border-gray-300 rounded-[10px] px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
              >
                <option value="">-- Pilih Rekening Tujuan --</option>
                {accounts
                  .filter(acc => acc.is_active && acc.id !== sourceId)
                  .map(acc => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} (Saldo: {formatRupiah(acc.balance)})
                    </option>
                  ))
                }
              </select>
            </div>

            {/* Transfer Amount */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Nominal Transfer <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-xs font-semibold">Rp</span>
                  </div>
                  <input 
                    required 
                    type="number" 
                    min="1" 
                    value={amount || ''}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-[10px] pl-10 pr-3.5 py-2.5 text-sm font-mono font-bold text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" 
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Admin Fee */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Biaya Admin (Jika Ada)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-xs font-semibold">Rp</span>
                  </div>
                  <input 
                    type="number" 
                    min="0"
                    value={adminFee || ''}
                    onChange={(e) => setAdminFee(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-[10px] pl-10 pr-3.5 py-2.5 text-sm font-mono text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" 
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Calculation Breakdown Panel */}
            {(amount > 0 || adminFee > 0) && (
              <div className="bg-gray-50 p-4 rounded-[10px] border border-gray-200 space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-150">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Rincian Pengurangan Saldo</h4>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Nominal Mutasi</span>
                    <span className="font-mono">{formatRupiah(amount)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Biaya Admin</span>
                    <span className="font-mono">{formatRupiah(adminFee)}</span>
                  </div>
                  <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-gray-950">
                    <span>Total Potongan</span>
                    <span className="font-mono text-indigo-700">{formatRupiah(totalDeduction)}</span>
                  </div>
                </div>
                {sourceBalance < totalDeduction && (
                  <p className="text-xs text-red-600 font-medium mt-1">⚠️ Saldo tidak mencukupi!</p>
                )}
              </div>
            )}
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
              disabled={isPending || sourceBalance < totalDeduction || amount <= 0}
              className="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-[10px] transition-all shadow-sm shadow-indigo-200 disabled:opacity-55 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {isPending ? 'Memproses Transfer...' : 'Kirim Transfer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
