'use client'

import { useState, useTransition } from 'react'
import { AddPaymentModal } from '@/components/deals/AddPaymentModal'
import { Plus, ArrowLeft, XCircle, AlertTriangle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Account, DealStatus } from '@/types/database'
import { cancelDeal } from '@/actions/deals'

interface DealDetailHeaderProps {
  dealId: string
  stockId: string
  status: DealStatus
  remainingBalance: number
  accounts: Account[]
}

export function DealDetailHeader({ dealId, stockId, status, remainingBalance, accounts }: DealDetailHeaderProps) {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [cancelError, setCancelError] = useState<string | null>(null)

  const isCancellable = remainingBalance > 0 && status !== 'CANCELLED_BY_BUYER' && status !== 'CANCELLED_BY_SELLER' && status !== 'COMPLETED' && status !== 'PROBLEM'

  const handleCancelDeal = () => {
    setCancelError(null)
    startTransition(async () => {
      const { success, error } = await cancelDeal(dealId, stockId)
      if (!success) {
        setCancelError(error || 'Gagal membatalkan transaksi.')
      } else {
        setIsCancelModalOpen(false)
        router.refresh()
      }
    })
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/deals" className="p-2 bg-white border border-gray-200 text-gray-600 hover:text-gray-900 rounded-[10px] shadow-sm transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Deal Details</h1>
            <p className="text-sm text-gray-500 mt-1">View history and manage payments for this deal.</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {isCancellable && (
            <button
              onClick={() => setIsCancelModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-white hover:bg-red-50 text-red-600 border border-red-200 px-4 py-2.5 rounded-[10px] font-semibold transition-all w-full sm:w-auto"
            >
              <XCircle className="w-5 h-5" />
              Batalkan Transaksi
            </button>
          )}

          {remainingBalance > 0 && status !== 'CANCELLED_BY_BUYER' && status !== 'CANCELLED_BY_SELLER' && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white px-5 py-2.5 rounded-[10px] font-semibold transition-all shadow-sm shadow-emerald-200 hover:shadow-md hover:shadow-emerald-200 w-full sm:w-auto"
            >
              <Plus className="w-5 h-5" />
              Input Next Payment
            </button>
          )}
        </div>
      </div>

      <AddPaymentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        dealId={dealId}
        remainingBalance={remainingBalance}
        accounts={accounts}
      />

      {/* Cancel Confirmation Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={!isPending ? () => setIsCancelModalOpen(false) : undefined} />
          <div className="relative w-full max-w-md bg-white rounded-[10px] shadow-2xl p-6 overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 mb-4 text-red-600">
              <div className="p-2 bg-red-100 rounded-[10px]">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold">Batalkan Transaksi?</h2>
            </div>
            
            <p className="text-gray-600 text-sm mb-6">
              Anda yakin ingin membatalkan deal ini? Status deal akan menjadi <strong>Batal</strong> dan stok akun akan dikembalikan ke status <strong>Tersedia</strong> di inventori.
            </p>

            {cancelError && (
              <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-700 text-xs rounded-[10px] font-medium">
                ⚠️ {cancelError}
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => {
                  setIsCancelModalOpen(false)
                  setCancelError(null)
                }}
                disabled={isPending}
                className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-[10px] transition-all"
              >
                Kembali
              </button>
              <button 
                onClick={handleCancelDeal}
                disabled={isPending}
                className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-[10px] transition-all shadow-sm shadow-red-200 disabled:opacity-70 flex items-center gap-2"
              >
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                {isPending ? 'Membatalkan...' : 'Ya, Batalkan Transaksi'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
