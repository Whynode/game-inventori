'use client'

import { LedgerWithRelations } from '@/types/database'
import { ArrowUpRight, ArrowDownLeft, Eye, Edit2, Trash2, Wallet } from 'lucide-react'
import { formatRupiah, formatDate } from '@/lib/utils'

interface LedgerTableProps {
  entries: LedgerWithRelations[]
}

export function LedgerTable({ entries }: LedgerTableProps) {
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
    <div className="w-full bg-white border border-slate-100 rounded-md shadow-sm overflow-hidden">
      <table className="w-full table-fixed divide-y divide-slate-100">
        <thead className="bg-slate-50/50">
          <tr>
            <th className="py-2.5 px-3 text-left text-xs font-semibold text-slate-800 border-b border-slate-100 w-[5%]">No</th>
            <th className="py-2.5 px-3 text-left text-xs font-semibold text-slate-800 border-b border-slate-100 w-[15%]">Tanggal</th>
            <th className="py-2.5 px-3 text-left text-xs font-semibold text-slate-800 border-b border-slate-100 w-[17%]">Tipe Transaksi</th>
            <th className="py-2.5 px-3 text-center text-xs font-semibold text-slate-800 border-b border-slate-100 w-[8%]">Referensi</th>
            <th className="py-2.5 px-3 text-left text-xs font-semibold text-slate-800 border-b border-slate-100 w-[20%]">Nominal</th>
            <th className="py-2.5 px-3 text-left text-xs font-semibold text-slate-800 border-b border-slate-100 w-[25%]">Catatan</th>
            <th className="py-2.5 px-3 text-left text-xs font-semibold text-slate-800 border-b border-slate-100 w-[10%]">Aksi</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-100">
          {entries.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-3 py-12 text-center text-sm text-slate-500">
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
                <tr key={entry.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="py-2.5 px-3 text-sm text-slate-600">
                    {index + 1}
                  </td>
                  <td className="py-2.5 px-3 text-sm text-slate-600">
                    {formattedDate}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium ${
                      isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {formatTxType(entry.transaction_type)}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex justify-center items-center">
                      {getAccountIcon(entry.account)}
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-sm font-semibold text-slate-900 tracking-tight">
                    {isPositive ? '+' : ''} {formatRupiah(Number(entry.amount))}
                  </td>
                  <td className="py-2.5 px-3 text-sm text-slate-600">
                    {entry.description || '-'}
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex flex-row items-center justify-start gap-1.5">
                      <button className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
