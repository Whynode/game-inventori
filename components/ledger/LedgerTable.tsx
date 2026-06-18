'use client'

import { useState, Fragment } from 'react'
import { LedgerWithRelations } from '@/types/database'
import { ArrowUpRight, ArrowDownLeft, Eye, Edit2, Trash2, Wallet } from 'lucide-react'
import { formatRupiah, formatDate } from '@/lib/utils'

interface LedgerTableProps {
  entries: LedgerWithRelations[]
}

export function LedgerTable({ entries }: LedgerTableProps) {
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null)

  const formatTxType = (type: string) => {
    switch (type) {
      case 'PAYMENT_IN': return 'Pembayaran Masuk'
      case 'PAYMENT_OUT': return 'Pembayaran Keluar'
      case 'REFUND': return 'Refund'
      case 'CASHBACK': return 'Cashback TT'
      case 'TRANSFER_IN': return 'Mutasi Masuk'
      case 'TRANSFER_OUT': return 'Mutasi Keluar'
      case 'STOCK_PURCHASE': return 'Pembelian Stok'
      case 'ADJUSTMENT': return 'Penyesuaian'
      default: return type
    }
  }

  const getAccountIcon = (account: any) => {
    if (account?.image_url) {
      return <img src={account.image_url} className="w-7 h-7 rounded-full shadow-sm object-cover" alt={account.name} />
    }
    
    const name = account?.name?.toLowerCase() || ''
    if (name.includes('dana')) return <div className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center text-[12px] font-bold shadow-sm">D</div>
    if (name.includes('ovo')) return <div className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center text-[12px] font-bold shadow-sm">O</div>
    if (name.includes('gopay')) return <div className="w-7 h-7 rounded-full bg-sky-500 text-white flex items-center justify-center text-[12px] font-bold shadow-sm">G</div>
    if (name.includes('bca')) return <div className="w-7 h-7 rounded-full bg-blue-800 text-white flex items-center justify-center text-[12px] font-bold shadow-sm">B</div>
    return <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center shadow-sm"><Wallet className="w-3.5 h-3.5" /></div>
  }

  return (
    <div className="w-full overflow-x-auto border border-slate-200 rounded-xl bg-white">
      <table className="w-full table-fixed whitespace-nowrap">
        <thead className="bg-blue-600 border-b border-blue-700">
          <tr>
            <th className="py-2 px-3 text-center text-[11px] font-semibold text-white uppercase tracking-wide w-12">No</th>
            <th className="py-2 px-3 text-left text-[11px] font-semibold text-white uppercase tracking-wide w-32">Tanggal</th>
            <th className="py-2 px-3 text-left text-[11px] font-semibold text-white uppercase tracking-wide w-40">Tipe Transaksi</th>
            <th className="py-2 px-3 text-center text-[11px] font-semibold text-white uppercase tracking-wide w-16">Ref</th>
            <th className="py-2 px-3 text-left text-[11px] font-semibold text-white uppercase tracking-wide w-40">Nominal</th>
            <th className="py-2 px-3 text-left text-[11px] font-semibold text-white uppercase tracking-wide">Catatan</th>
            <th className="py-2 px-3 text-right text-[11px] font-semibold text-white uppercase tracking-wide w-28">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {entries.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-12 text-center text-sm text-slate-500">
                <div className="flex flex-col items-center justify-center">
                  <span className="text-slate-400 mb-2 text-2xl">📊</span>
                  <span className="font-semibold text-slate-900">Belum ada catatan transaksi</span>
                </div>
              </td>
            </tr>
          ) : (
            entries.map((entry, index) => {
              const isPositive = Number(entry.amount) > 0
              const formattedDate = formatDate(entry.created_at)
              const accountName = entry.account?.name || '-'

              return (
                <Fragment key={entry.id}>
                  <tr 
                    onClick={() => setExpandedRowId(expandedRowId === entry.id ? null : entry.id)}
                    className={`hover:bg-slate-50/50 transition-colors group cursor-pointer ${expandedRowId === entry.id ? 'bg-slate-50/50' : ''}`}
                  >
                    <td className="py-2 px-3 text-center text-[13px] text-slate-600 truncate">
                      {index + 1}
                    </td>
                  <td className="py-2 px-3 text-[13px] text-slate-600 truncate" title={formattedDate}>
                    {formattedDate}
                  </td>
                  <td className="py-2 px-3 truncate">
                    <span className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-medium truncate ${
                      isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`} title={formatTxType(entry.transaction_type)}>
                      {formatTxType(entry.transaction_type)}
                    </span>
                  </td>
                  <td className="py-2 px-3 truncate">
                    <div className="flex justify-center items-center">
                      {getAccountIcon(entry.account)}
                    </div>
                  </td>
                  <td className="py-2 px-3 text-[13px] font-semibold text-slate-900 tracking-tight truncate">
                    {isPositive ? '+' : ''} {formatRupiah(Number(entry.amount))}
                  </td>
                  <td className="py-2 px-3 text-[13px] text-slate-600 truncate" title={entry.description || ''}>
                    {entry.description || '-'}
                  </td>
                  <td className="py-2 px-3 truncate">
                    <div className="flex flex-row items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedRowId === entry.id && (
                  <tr className="bg-slate-50/50 border-b border-slate-100/50">
                    <td colSpan={7} className="py-4 px-4 whitespace-normal">
                      <div className="text-[13px] text-slate-700 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                        <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Catatan Lengkap</span>
                        <p className="whitespace-pre-wrap leading-relaxed">{entry.description || 'Tidak ada catatan untuk transaksi ini.'}</p>
                      </div>
                    </td>
                  </tr>
                )}
                </Fragment>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
