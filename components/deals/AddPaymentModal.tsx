'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { addPayment } from '@/actions/deals'
import { X, Loader2 } from 'lucide-react'
import { Account } from '@/types/database'
import { formatRupiah } from '@/lib/utils'

interface AddPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  dealId: string
  remainingBalance: number
  accounts: Account[]
}

export function AddPaymentModal({ isOpen, onClose, dealId, remainingBalance, accounts }: AddPaymentModalProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  if (!isOpen) return null

  async function handleSubmit(formData: FormData) {
    setErrorMsg(null)
    
    const accountId = formData.get('account_id') as string
    const amount = Number(formData.get('amount'))
    const notes = formData.get('notes') as string

    if (!accountId || amount <= 0) {
      setErrorMsg('Please enter a valid amount and select an account.')
      return
    }

    startTransition(async () => {
      const { error } = await addPayment(dealId, accountId, amount, notes)
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
      <div className="relative w-full max-w-lg bg-white rounded-[10px] shadow-2xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Input Next Payment</h2>
          <button 
            onClick={onClose}
            disabled={isPending}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-[10px] transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm font-medium rounded-[10px] border border-red-100 flex items-start">
              <span>⚠️</span>
              <span className="ml-2">{errorMsg}</span>
            </div>
          )}

          <div className="mb-6 p-4 bg-blue-50/50 rounded-[10px] border border-blue-100 flex justify-between items-center">
             <span className="text-sm font-medium text-gray-600">Remaining Balance:</span>
             <span className="text-lg font-bold font-mono text-blue-700">{formatRupiah(remainingBalance)}</span>
          </div>

          <form id="add-payment-form" action={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Payment Amount (Rp) <span className="text-red-500">*</span></label>
              <input required name="amount" type="number" min="1" max={remainingBalance} className="w-full border border-gray-300 rounded-[10px] px-4 py-2.5 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400" placeholder="0" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Select Account / Method <span className="text-red-500">*</span></label>
              <select required name="account_id" className="w-full border border-gray-300 rounded-[10px] px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white">
                <option value="">-- Choose Account --</option>
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>{acc.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Notes / Ref Number</label>
              <input name="notes" type="text" className="w-full border border-gray-300 rounded-[10px] px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400" placeholder="e.g. TF BCA a.n. Budi" />
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
            Cancel
          </button>
          <button 
            type="submit"
            form="add-payment-form"
            disabled={isPending}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-[10px] transition-all shadow-sm shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {isPending ? 'Processing...' : 'Submit Payment'}
          </button>
        </div>
      </div>
    </div>
  )
}
