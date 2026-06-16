'use client'

import { useState } from 'react'
import { updateItemStatus } from '@/actions/inventory'
import { Copy, Check, X, Loader2 } from 'lucide-react'

export function CaptionGeneratorModal({ item, isOpen, onClose }: { item: any, isOpen: boolean, onClose: () => void }) {
 const [copied, setCopied] = useState(false)
 const [isUpdating, setIsUpdating] = useState(false)

 if (!isOpen || !item) return null

 const formatCurrency = (amount: number) => {
 return new Intl.NumberFormat('id-ID', {
 style: 'currency',
 currency: 'IDR',
 minimumFractionDigits: 0,
 maximumFractionDigits: 0
 }).format(amount)
 }

 const captionText = `[Game] ${item.games?.name || 'Game'} Account Available!\nRef: ${item.title_reference}\n\nSpecs:\n${item.account_specs}\n\nHarga: ${formatCurrency(item.asking_price)}\n\nDM for details!`

 const handleCopy = async () => {
 try {
 await navigator.clipboard.writeText(captionText)
 setCopied(true)
 } catch (err) {
 console.error('Failed to copy', err)
 }
 }

 const handleMarkAvailable = async () => {
 setIsUpdating(true)
 await updateItemStatus(item.id, 'AVAILABLE')
 setIsUpdating(false)
 setCopied(false)
 onClose()
 }

 const handleClose = () => {
 setCopied(false)
 onClose()
 }

 return (
 <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
 <div className="bg-white rounded-lg w-full max-w-lg overflow-hidden border border-slate-200 flex flex-col animate-in fade-in zoom-in-95 duration-200">
 <div className="flex justify-between items-center p-6 border-b border-slate-200 bg-slate-50/50">
 <h2 className="text-lg font-semibold text-slate-900">Buat Caption</h2>
 <button onClick={handleClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-md hover:bg-slate-200">
 <X className="h-5 w-5" />
 </button>
 </div>

 <div className="p-6 space-y-6 flex-1 overflow-auto">
 <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 whitespace-pre-wrap text-sm text-slate-700 font-normal leading-relaxed">
 {captionText}
 </div>
 
 {!copied ? (
 <button
 onClick={handleCopy}
 className="w-full flex items-center justify-center space-x-2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all font-medium"
 >
 <Copy className="h-5 w-5" />
 <span>Salin</span>
 </button>
 ) : (
 <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-6 text-center space-y-4 animate-in fade-in slide-in-from-bottom-2">
 <div className="flex justify-center text-blue-600 mb-2">
 <Check className="h-10 w-10 bg-blue-100 p-2 rounded-full " />
 </div>
 <div>
 <p className="font-semibold text-slate-900">Caption disalin!</p>
 <p className="text-sm text-slate-500 mt-1">Apakah kamu ingin menandai akun ini sebagai SIAP JUAL (AVAILABLE)?</p>
 </div>
 <div className="flex space-x-3 pt-2">
 <button
 onClick={handleClose}
 disabled={isUpdating}
 className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm disabled:opacity-50 "
 >
 Tidak, Tetap Belum Posting
 </button>
 <button
 onClick={handleMarkAvailable}
 disabled={isUpdating}
 className="flex-1 flex items-center justify-center py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm disabled:opacity-70"
 >
 {isUpdating ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
 Ya, Tandai Siap Jual
 </button>
 </div>
 </div>
 )}
 </div>
 </div>
 </div>
 )
}
