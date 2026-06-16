'use client'

import { useState } from 'react'
import { MoreHorizontal, Wand2, BadgeDollarSign } from 'lucide-react'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { CaptionGeneratorModal } from '@/components/features/CaptionGeneratorModal'
import { MarkSoldModal } from '@/components/features/MarkSoldModal'

interface InventoryTableProps {
 inventory: any[]
 hideActions?: boolean
}

export function InventoryTable({ inventory, hideActions = false }: InventoryTableProps) {
 const [selectedItem, setSelectedItem] = useState<any | null>(null)
 const [selectedSoldItem, setSelectedSoldItem] = useState<any | null>(null)

 const formatCurrency = (amount: number) => {
 return new Intl.NumberFormat('id-ID', {
 style: 'currency',
 currency: 'IDR',
 minimumFractionDigits: 0,
 maximumFractionDigits: 0
 }).format(amount)
 }

 const formatDate = (dateString: string) => {
 const date = new Date(dateString)
 return new Intl.DateTimeFormat('en-GB', {
 day: 'numeric',
 month: 'short',
 year: 'numeric'
 }).format(date)
 }

 const columnCount = hideActions ? 6 : 6

 return (
 <>
 <div className="bg-white rounded-lg overflow-hidden border border-slate-200">
 <div className="overflow-x-auto">
 <table className="w-full text-left text-sm whitespace-nowrap">
 <thead className="bg-slate-50/50 border-b border-slate-200 text-slate-500 font-medium tracking-wide">
 <tr>
 <th scope="col" className="px-6 py-4">Kode Ref</th>
 <th scope="col" className="px-6 py-4">Game</th>
 <th scope="col" className="px-6 py-4">Target Jual</th>
 {hideActions && (
 <th scope="col" className="px-6 py-4">Harga Laku</th>
 )}
 <th scope="col" className="px-6 py-4">Status</th>
 <th scope="col" className="px-6 py-4">
 {hideActions ? 'Tanggal Laku' : 'Tanggal Masuk'}
 </th>
 {!hideActions && (
 <th scope="col" className="px-6 py-4 text-right">Aksi</th>
 )}
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100 text-slate-700">
 {inventory && inventory.length > 0 ? (
 inventory.map((item: any) => (
 <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
 <td className="px-6 py-4 font-medium text-slate-900">
 {item.title_reference}
 </td>
 <td className="px-6 py-4">
 {item.games?.name || 'Unknown'}
 </td>
 <td className="px-6 py-4">
 {formatCurrency(item.asking_price)}
 </td>
 {hideActions && (
 <td className="px-6 py-4 font-medium text-emerald-600">
 {item.sold_price ? formatCurrency(item.sold_price) : '—'}
 </td>
 )}
 <td className="px-6 py-4">
 <StatusBadge status={item.status} />
 </td>
 <td className="px-6 py-4 text-slate-500">
 {hideActions && item.sold_at
 ? formatDate(item.sold_at)
 : formatDate(item.created_at)}
 </td>
 {!hideActions && (
 <td className="px-6 py-4 text-right flex items-center justify-end space-x-2">
 {item.status === 'UNPOSTED' && (
 <button 
 onClick={() => setSelectedItem(item)}
 title="Buat Caption"
 className="px-3 py-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center space-x-1 border border-blue-100/50 "
 >
 <Wand2 className="h-3.5 w-3.5" />
 <span className="text-xs font-medium">Buat Caption</span>
 </button>
 )}
 {(item.status === 'UNPOSTED' || item.status === 'AVAILABLE') && (
 <button 
 onClick={() => {
 setSelectedSoldItem(item);
 setSelectedItem(null);
 }}
 title="Tandai Laku"
 className="px-3 py-1.5 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors flex items-center space-x-1 border border-emerald-100/50 "
 >
 <BadgeDollarSign className="h-3.5 w-3.5" />
 <span className="text-xs font-medium">Tandai Laku</span>
 </button>
 )}
 <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
 <MoreHorizontal className="h-4 w-4" />
 </button>
 </td>
 )}
 </tr>
 ))
 ) : (
 <tr>
 <td colSpan={columnCount} className="px-6 py-12 text-center text-slate-500">
 Belum ada data akun di sini.
 </td>
 </tr>
 )}
 </tbody>
 </table>
 </div>
 </div>

 {!hideActions && (
 <>
 <CaptionGeneratorModal 
 item={selectedItem} 
 isOpen={!!selectedItem} 
 onClose={() => setSelectedItem(null)} 
 />

 <MarkSoldModal
 item={selectedSoldItem}
 isOpen={!!selectedSoldItem}
 onClose={() => setSelectedSoldItem(null)}
 />
 </>
 )}
 </>
 )
}
