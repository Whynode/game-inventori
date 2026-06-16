'use client'

import { useState } from 'react'
import { markItemAsSold } from '@/actions/inventory'
import { CheckCircle, X, Loader2 } from 'lucide-react'

export function MarkSoldModal({ item, isOpen, onClose }: { item: any, isOpen: boolean, onClose: () => void }) {
 const [soldPrice, setSoldPrice] = useState(item?.asking_price || '')
 const [isUpdating, setIsUpdating] = useState(false)
 const [error, setError] = useState<string | null>(null)

 if (!isOpen || !item) return null

 const formatCurrency = (amount: number) => {
 return new Intl.NumberFormat('id-ID', {
 style: 'currency',
 currency: 'IDR',
 minimumFractionDigits: 0,
 maximumFractionDigits: 0
 }).format(amount)
 }

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault()
 setError(null)
 setIsUpdating(true)

 const parsedPrice = Number(soldPrice)
 if (isNaN(parsedPrice) || parsedPrice <= 0) {
 setError('Please enter a valid final selling price.')
 setIsUpdating(false)
 return
 }

 const result = await markItemAsSold(item.id, parsedPrice)
 setIsUpdating(false)

 if (result.success) {
 onClose()
 } else {
 setError(result.error || 'Failed to update the item.')
 }
 }

 return (
 <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
 <div className="bg-white rounded-lg w-full max-w-md overflow-hidden border border-slate-200 flex flex-col animate-in fade-in zoom-in-95 duration-200">
 <div className="flex justify-between items-center p-6 border-b border-slate-200 bg-slate-50/50">
 <div className="flex items-center space-x-2 text-emerald-600">
 <CheckCircle className="h-5 w-5" />
 <h2 className="text-lg font-semibold text-slate-900">Tandai Laku</h2>
 </div>
 <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-md hover:bg-slate-200">
 <X className="h-5 w-5" />
 </button>
 </div>

 <form onSubmit={handleSubmit} className="p-6 space-y-6">
 <div className="space-y-4">
 <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex justify-between items-center">
 <div>
 <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Harga Modal</p>
 <p className="font-semibold text-slate-700">{formatCurrency(item.capital_price)}</p>
 </div>
 <div className="text-right">
 <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Target Jual</p>
 <p className="font-semibold text-slate-900">{formatCurrency(item.asking_price)}</p>
 </div>
 </div>

 <div className="space-y-1">
 <label className="block text-sm font-medium text-slate-700" htmlFor="soldPrice">
 Harga Laku Terjual (Rp)
 </label>
 <input
 id="soldPrice"
 type="number"
 value={soldPrice}
 onChange={(e) => setSoldPrice(e.target.value)}
 min="0"
 required
 className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 transition-colors "
 />
 </div>
 
 {error && (
 <p className="text-sm text-rose-600 bg-rose-50 p-2 rounded-md">{error}</p>
 )}
 </div>

 <div className="flex space-x-3 pt-2">
 <button
 type="button"
 onClick={onClose}
 disabled={isUpdating}
 className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm disabled:opacity-50 "
 >
 Batal
 </button>
 <button
 type="submit"
 disabled={isUpdating}
 className="flex-1 flex items-center justify-center py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm disabled:opacity-70"
 >
 {isUpdating ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
 Konfirmasi Terjual
 </button>
 </div>
 </form>
 </div>
 </div>
 )
}
