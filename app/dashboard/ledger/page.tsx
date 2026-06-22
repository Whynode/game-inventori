'use client'

import React, { useState, useEffect } from 'react'
import { Search, Filter, Calendar, FileText, ChevronDown, MoreHorizontal, ArrowUpRight, ArrowDownRight, ArrowRightLeft, PenTool, Loader2 } from 'lucide-react'
import { formatRupiah, formatDate } from '@/lib/utils'
import { getLedgers } from '@/app/actions/ledger'

type LedgerRecord = any // Using any for joined type or define properly later

export default function LedgerPage() {
  const [ledgers, setLedgers] = useState<LedgerRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadLedgers()
  }, [])

  const loadLedgers = async () => {
    try {
      setIsLoading(true)
      const data = await getLedgers()
      setLedgers(data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Buku Kas / Ledger</h1>
          <p className="text-sm text-slate-500 mt-0.5">Catatan riwayat seluruh pergerakan uang masuk, keluar, dan mutasi internal.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm">
            <FileText className="h-4 w-4" />
            Export Excel
          </button>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white border border-slate-100 shadow-sm rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-900 placeholder-slate-400 bg-slate-50 outline-none transition-all"
            placeholder="Cari referensi, catatan, atau ID..."
          />
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <button className="inline-flex items-center justify-between gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 flex-1 sm:flex-none">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <span>Semua Rekening</span>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>
          <button className="inline-flex items-center justify-between gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 flex-1 sm:flex-none">
            <span>Semua Status</span>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>
          <button className="inline-flex items-center justify-between gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span>1 Jun - 30 Jun 2026</span>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-100 shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50/80">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Tanggal & ID
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Tipe Transaksi
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Rekening
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Referensi / Catatan
                </th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Nominal
                </th>
                <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
                  </td>
                </tr>
              ) : ledgers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-500">
                    Belum ada riwayat mutasi.
                  </td>
                </tr>
              ) : (
                ledgers.map((tx) => {
                  const isPositive = Number(tx.amount) >= 0
                  
                  // Determine Badge styling based on transaction type
                  let typeBadge = ''
                  let IconType = ArrowUpRight
                  if (tx.transaction_type === 'Pembayaran Masuk') {
                    typeBadge = 'bg-emerald-50 text-emerald-600 border-emerald-100'
                    IconType = ArrowUpRight
                  } else if (tx.transaction_type === 'Mutasi Masuk') {
                    typeBadge = 'bg-blue-50 text-blue-600 border-blue-100'
                    IconType = ArrowRightLeft
                  } else if (tx.transaction_type === 'Mutasi Keluar') {
                    typeBadge = 'bg-rose-50 text-rose-600 border-rose-100'
                    IconType = ArrowDownRight
                  } else if (tx.transaction_type === 'Penyesuaian' || tx.transaction_type === 'Refund' || tx.transaction_type === 'Pengeluaran Operasional' || tx.transaction_type === 'Pembayaran Pembelian Stok') {
                    typeBadge = 'bg-amber-50 text-amber-600 border-amber-100'
                    IconType = PenTool
                  }

                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        <div className="flex flex-col">
                          <span className="text-[11px] font-medium text-slate-400 mb-0.5">{formatDate(tx.created_at)}</span>
                          <span className="font-semibold text-slate-900 truncate w-24" title={tx.id}>{tx.id.split('-')[0]}...</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${typeBadge}`}>
                          <IconType className="h-3 w-3" />
                          {tx.transaction_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-600">
                        {tx.accounts?.name || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        <div className="flex flex-col max-w-[250px]">
                          <span className="font-semibold text-slate-900 truncate">Ref: {tx.ref_id || '-'}</span>
                          <span className="text-xs text-slate-500 truncate mt-0.5">{tx.notes || '-'}</span>
                        </div>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold text-right tracking-tight ${isPositive ? 'text-emerald-600' : 'text-slate-900'}`}>
                        {isPositive ? '+' : ''}{formatRupiah(Number(tx.amount))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <button className="text-slate-400 hover:text-blue-600 transition-colors p-1 rounded-md hover:bg-blue-50">
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Mockup */}
        <div className="bg-white px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <div className="text-sm text-slate-500">
            Menampilkan <span className="font-semibold text-slate-900">{ledgers.length > 0 ? 1 : 0}</span> - <span className="font-semibold text-slate-900">{ledgers.length}</span> dari <span className="font-semibold text-slate-900">{ledgers.length}</span> mutasi
          </div>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-slate-200 text-slate-400 rounded-md text-sm cursor-not-allowed">Sebelummnya</button>
            <button className="px-3 py-1 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-md text-sm font-medium">Selanjutnya</button>
          </div>
        </div>
      </div>
    </div>
  )
}
