'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { purchaseStock } from '@/actions/purchases'
import { Account, PurchasePaymentStatus } from '@/types/database'
import { Loader2, AlertCircle, ShoppingCart } from 'lucide-react'
import { formatRupiah } from '@/lib/utils'

export function StockPurchaseForm({ accounts }: { accounts: Account[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  
  const [paymentStatus, setPaymentStatus] = useState<PurchasePaymentStatus>('LUNAS')

  async function handleSubmit(formData: FormData) {
    setErrorMsg(null)
    setSuccessMsg(null)
    
    const data = {
      category: formData.get('category') as string,
      name: formData.get('name') as string,
      account_details: formData.get('account_details') as string,
      username: formData.get('username') as string,
      password: formData.get('password') as string,
      capital_price: Number(formData.get('capital_price')),
      post_price: Number(formData.get('post_price')),
      current_price: Number(formData.get('current_price')),
      seller_info: formData.get('seller_info') as string,
      internal_notes: formData.get('internal_notes') as string,
      purchase_payment_status: paymentStatus,
      payment_account_id: paymentStatus === 'LUNAS' ? (formData.get('payment_account_id') as string) : null,
    }

    if (paymentStatus === 'LUNAS' && !data.payment_account_id) {
      setErrorMsg('You must select a source account when payment status is LUNAS.')
      return
    }

    startTransition(async () => {
      const { success, error } = await purchaseStock(data)
      if (error) {
        setErrorMsg(error)
      } else {
        setSuccessMsg('Stock purchased and recorded successfully!')
        // Reset form
        const form = document.getElementById('purchase-form') as HTMLFormElement
        if (form) form.reset()
        router.refresh()
      }
    })
  }

  return (
    <div className="bg-white rounded-[10px] shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-purple-600 px-6 py-6 text-white flex items-center gap-3">
        <ShoppingCart className="w-6 h-6 text-purple-100" />
        <div>
          <h2 className="text-xl font-bold">New Stock Purchase Invoice</h2>
          <p className="text-purple-100 text-sm mt-0.5">Enter details of the stock acquired from the seller.</p>
        </div>
      </div>
      
      <div className="p-6 md:p-8">
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm font-medium rounded-[10px] border border-red-100 flex items-start">
            <AlertCircle className="w-5 h-5 mr-2 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-[10px] border border-emerald-100 flex items-start">
            <span className="mr-2">✅</span>
            <span>{successMsg}</span>
          </div>
        )}

        <form id="purchase-form" action={handleSubmit} className="space-y-8">
          
          {/* Game Details Section */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">1. Item Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Category <span className="text-red-500">*</span></label>
                <input required name="category" type="text" className="w-full border border-gray-300 rounded-[10px] px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all placeholder:text-gray-400" placeholder="e.g. Mobile Legends" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Stock Code / Name <span className="text-red-500">*</span></label>
                <input required name="name" type="text" className="w-full border border-gray-300 rounded-[10px] px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all placeholder:text-gray-400" placeholder="e.g. Akun Sultan GG" />
              </div>
            </div>
          </div>

          {/* Credentials Section */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">2. Credentials</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Username / Email</label>
                <input name="username" type="text" className="w-full border border-gray-300 rounded-[10px] px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all placeholder:text-gray-400" placeholder="Login ID" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Password</label>
                <input name="password" type="text" className="w-full border border-gray-300 rounded-[10px] px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all placeholder:text-gray-400" placeholder="Password" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Login Details</label>
              <input name="account_details" type="text" className="w-full border border-gray-300 rounded-[10px] px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all placeholder:text-gray-400" placeholder="e.g. Login via Moonton / Google" />
            </div>
          </div>

          {/* Pricing & Financials */}
          <div className="bg-gray-50 -mx-6 md:-mx-8 px-6 md:px-8 py-8 border-y border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">3. Pricing & Payment</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-800">Capital Price (Harga Modal) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm font-medium">Rp</span>
                  </div>
                  <input required name="capital_price" type="number" className="w-full border border-gray-300 rounded-[10px] pl-12 pr-4 py-2.5 text-sm font-mono font-bold text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all" placeholder="0" />
                </div>
                <p className="text-xs text-gray-500 mt-1">Cost to acquire this stock.</p>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Post Price (Harga Coret) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">Rp</span>
                  </div>
                  <input required name="post_price" type="number" className="w-full border border-gray-300 rounded-[10px] pl-12 pr-4 py-2.5 text-sm font-mono focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all" placeholder="0" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-800">Selling Price (Harga Jual) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm font-medium">Rp</span>
                  </div>
                  <input required name="current_price" type="number" className="w-full border border-gray-300 rounded-[10px] pl-12 pr-4 py-2.5 text-sm font-mono font-bold text-blue-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all" placeholder="0" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-[10px] border border-gray-200 shadow-sm">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-900">Purchase Payment Status <span className="text-red-500">*</span></label>
                <div className="flex gap-4">
                  <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-[10px] border cursor-pointer transition-all ${paymentStatus === 'LUNAS' ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-1 ring-emerald-500' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
                    <input type="radio" name="purchase_payment_status" value="LUNAS" checked={paymentStatus === 'LUNAS'} onChange={() => setPaymentStatus('LUNAS')} className="hidden" />
                    <span className="font-semibold text-sm">LUNAS</span>
                  </label>
                  <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-[10px] border cursor-pointer transition-all ${paymentStatus === 'PENDING' ? 'bg-amber-50 border-amber-500 text-amber-800 ring-1 ring-amber-500' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
                    <input type="radio" name="purchase_payment_status" value="PENDING" checked={paymentStatus === 'PENDING'} onChange={() => setPaymentStatus('PENDING')} className="hidden" />
                    <span className="font-semibold text-sm">PENDING</span>
                  </label>
                </div>
                <p className="text-xs text-gray-500">
                  {paymentStatus === 'LUNAS' 
                    ? 'Will instantly deduct from the selected account and record in ledger.' 
                    : 'Records stock as liability. Account balance will not be deducted yet.'}
                </p>
              </div>

              {paymentStatus === 'LUNAS' && (
                <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2">
                  <label className="text-sm font-bold text-gray-900">Source Account (Rekening) <span className="text-red-500">*</span></label>
                  <select required name="payment_account_id" className="w-full border border-gray-300 rounded-[10px] px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all bg-white font-medium text-gray-800">
                    <option value="">-- Choose Account to Deduct --</option>
                    {accounts.map(acc => (
                      <option key={acc.id} value={acc.id}>{acc.name} (Saldo: {formatRupiah(acc.balance)})</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Additional Info */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">4. Additional Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Seller Info</label>
                <input name="seller_info" type="text" className="w-full border border-gray-300 rounded-[10px] px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all placeholder:text-gray-400" placeholder="e.g. Nama Seller / WA / Grup FB" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Internal Notes</label>
                <input name="internal_notes" type="text" className="w-full border border-gray-300 rounded-[10px] px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all placeholder:text-gray-400" placeholder="e.g. Butuh change email 7 hari" />
              </div>
            </div>
          </div>

          <div className="pt-6 flex justify-end">
            <button 
              type="submit"
              disabled={isPending}
              className="px-8 py-3.5 text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 active:bg-purple-800 rounded-[10px] transition-all shadow-sm shadow-purple-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isPending && <Loader2 className="w-5 h-5 animate-spin" />}
              {isPending ? 'Processing Secure Transaction...' : 'Complete Purchase'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
