'use client'

import { useState, Fragment } from 'react'
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
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null)

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
 <div className="w-full overflow-x-auto border border-slate-200 rounded-xl bg-white">
 <table className="w-full table-fixed text-left text-[13px] whitespace-nowrap">
 <thead className="bg-blue-600 border-b border-blue-700">
  <tr>
    <th scope="col" className="py-2 px-3 text-[11px] font-semibold text-white uppercase tracking-wide">Kode Ref</th>
    <th scope="col" className="py-2 px-3 text-[11px] font-semibold text-white uppercase tracking-wide w-40">Game</th>
    <th scope="col" className="py-2 px-3 text-[11px] font-semibold text-white uppercase tracking-wide w-32">Target Jual</th>
    {hideActions && (
      <th scope="col" className="py-2 px-3 text-[11px] font-semibold text-white uppercase tracking-wide w-32">Harga Laku</th>
    )}
    <th scope="col" className="py-2 px-3 text-[11px] font-semibold text-white uppercase tracking-wide w-28">Status</th>
    <th scope="col" className={`py-2 px-3 text-[11px] font-semibold text-white uppercase tracking-wide w-36`}>
      {hideActions ? 'Tanggal Laku' : 'Tanggal Masuk'}
    </th>
    {!hideActions && (
      <th scope="col" className="py-2 px-3 text-right text-[11px] font-semibold text-white uppercase tracking-wide w-56">Aksi</th>
    )}
  </tr>
 </thead>
 <tbody className="divide-y divide-slate-50">
 {inventory && inventory.length > 0 ? (
  inventory.map((item: any) => (
    <Fragment key={item.id}>
    <tr 
      onClick={() => setExpandedRowId(expandedRowId === item.id ? null : item.id)}
      className={`hover:bg-slate-50/50 transition-colors group cursor-pointer ${expandedRowId === item.id ? 'bg-slate-50/50' : ''}`}
    >
      <td className="py-2 px-3 font-medium text-slate-900 truncate" title={item.title_reference}>
  {item.title_reference}
  </td>
  <td className="py-2 px-3 truncate">
  <span className="inline-flex px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[11px] font-medium truncate" title={item.games?.name || 'Unknown'}>
  {item.games?.name || 'Unknown'}
  </span>
  </td>
  <td className="py-2 px-3 text-slate-600 truncate" title={formatCurrency(item.asking_price)}>
  {formatCurrency(item.asking_price)}
  </td>
  {hideActions && (
  <td className="py-2 px-3 font-medium text-emerald-600 truncate" title={item.sold_price ? formatCurrency(item.sold_price) : '—'}>
  {item.sold_price ? formatCurrency(item.sold_price) : '—'}
  </td>
  )}
  <td className="py-2 px-3 truncate">
  <StatusBadge status={item.status} />
  </td>
  <td className="py-2 px-3 text-slate-600 truncate">
  {hideActions && item.sold_at
  ? formatDate(item.sold_at)
  : formatDate(item.created_at)}
  </td>
  {!hideActions && (
  <td className="py-2 px-3 text-right flex items-center justify-end space-x-2 truncate" onClick={(e) => e.stopPropagation()}>
  {item.status === 'UNPOSTED' && (
  <button 
  onClick={() => setSelectedItem(item)}
  title="Buat Caption"
  className="px-3 py-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-[10px] transition-colors flex items-center space-x-1 border border-blue-100/50 "
  >
  <Wand2 className="h-3.5 w-3.5" />
  <span className="text-[11px] font-medium">Buat Caption</span>
  </button>
  )}
  {(item.status === 'UNPOSTED' || item.status === 'AVAILABLE') && (
  <button 
  onClick={() => {
  setSelectedSoldItem(item);
  setSelectedItem(null);
  }}
  title="Tandai Laku"
  className="px-3 py-1.5 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-[10px] transition-colors flex items-center space-x-1 border border-emerald-100/50 "
  >
  <BadgeDollarSign className="h-3.5 w-3.5" />
  <span className="text-[11px] font-medium">Tandai Laku</span>
  </button>
  )}
  <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-[10px] transition-colors">
  <MoreHorizontal className="h-4 w-4" />
  </button>
  </td>
  )}
 </tr>
 {expandedRowId === item.id && (
    <tr className="bg-slate-50/50 border-b border-slate-100/50">
      <td colSpan={columnCount} className="py-4 px-4 whitespace-normal">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px] bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <div>
            <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Detail Referensi & Game</span>
            <p className="font-medium text-slate-900 mb-0.5">{item.title_reference}</p>
            <p className="text-slate-500">{item.games?.name || 'Unknown Game'}</p>
          </div>
          <div>
            <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Status Transaksi</span>
            <p className="text-slate-700">
              <span className="font-medium text-slate-900">Dibuat:</span> {formatDate(item.created_at)}
            </p>
            {item.sold_at && (
              <p className="text-slate-700 mt-0.5">
                <span className="font-medium text-slate-900">Terjual:</span> {formatDate(item.sold_at)}
              </p>
            )}
            <p className="text-slate-700 mt-0.5">
              <span className="font-medium text-slate-900">Target Jual:</span> {formatCurrency(item.asking_price)}
            </p>
            {item.sold_price && (
              <p className="text-slate-700 mt-0.5">
                <span className="font-medium text-emerald-600">Harga Laku: {formatCurrency(item.sold_price)}</span>
              </p>
            )}
          </div>
        </div>
      </td>
    </tr>
  )}
  </Fragment>
  ))
 ) : (
  <tr>
  <td colSpan={columnCount} className="py-12 px-4 text-center text-sm text-slate-500">
  Belum ada data akun di sini.
  </td>
  </tr>
 )}
 </tbody>
  </table>
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
