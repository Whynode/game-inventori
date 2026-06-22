'use client'

import React, { useState, useEffect } from 'react'
import { Calendar, Download, ChevronDown, ArrowUpRight, ArrowDownRight, RefreshCw, Wallet, FileText, Loader2, Search } from 'lucide-react'
import { formatRupiah } from '@/lib/utils'
import { getLedgerEntries } from '@/actions/ledger'

const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
]

const YEARS = [2025, 2026, 2027]

export default function CashflowPage() {
  const [entries, setEntries] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [searchQuery, setSearchQuery] = useState('')
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false)
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false)

  const loadData = async () => {
    try {
      setIsLoading(true)
      setError('')
      const res = await getLedgerEntries()
      if (res.error) {
        setError(res.error)
      } else {
        setEntries(res.data || [])
      }
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Gagal memuat data arus kas.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Filter entries for the selected month and year
  const monthlyEntries = entries.filter(entry => {
    const d = new Date(entry.created_at)
    return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear
  })

  // Filter entries for the table based on search
  const filteredEntries = monthlyEntries.filter(entry => {
    const matchesSearch = searchQuery.trim() === '' || 
      (entry.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (entry.account?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (entry.transaction_type || '').toLowerCase().includes(searchQuery.toLowerCase())

    return matchesSearch
  })

  // Aggregation
  let cashIn = 0
  let cashOut = 0

  let totalPaymentIn = 0
  let totalTransferIn = 0
  let totalRefundIn = 0
  let totalCashbackIn = 0
  let totalAdjustmentIn = 0
  let totalOtherIn = 0

  let totalStockPurchase = 0
  let totalPaymentOut = 0
  let totalRefundOut = 0
  let totalCashbackOut = 0
  let totalTransferOut = 0
  let totalAdjustmentOut = 0
  let totalOtherOut = 0

  monthlyEntries.forEach(entry => {
    const amt = Number(entry.amount)
    if (amt > 0) {
      cashIn += amt
      switch (entry.transaction_type) {
        case 'PAYMENT_IN':
          // Distinguish DP / Cicilan vs Lunas via description keywords
          const desc = (entry.description || '').toLowerCase()
          if (desc.includes('dp') || desc.includes('cicilan') || desc.includes('down payment')) {
            totalCashbackIn += amt // Put in a different bucket temporarily or group
          } else {
            totalPaymentIn += amt
          }
          break
        case 'TRANSFER_IN':
          totalTransferIn += amt
          break
        case 'REFUND':
          totalRefundIn += amt
          break
        case 'CASHBACK':
          totalCashbackIn += amt
          break
        case 'ADJUSTMENT':
          totalAdjustmentIn += amt
          break
        default:
          totalOtherIn += amt
          break
      }
    } else if (amt < 0) {
      const absAmt = Math.abs(amt)
      cashOut += absAmt
      switch (entry.transaction_type) {
        case 'STOCK_PURCHASE':
          totalStockPurchase += absAmt
          break
        case 'PAYMENT_OUT':
          totalPaymentOut += absAmt
          break
        case 'REFUND':
          totalRefundOut += absAmt
          break
        case 'CASHBACK':
          totalCashbackOut += absAmt
          break
        case 'TRANSFER_OUT':
          totalTransferOut += absAmt
          break
        case 'ADJUSTMENT':
          totalAdjustmentOut += absAmt
          break
        default:
          totalOtherOut += absAmt
          break
      }
    }
  })

  const netCashflow = cashIn - cashOut

  // Split PAYMENT_IN breakdown nicely
  const inflows = [
    { label: 'Penerimaan Penjualan (Lunas)', amount: totalPaymentIn },
    { label: 'Penerimaan DP / Cicilan', amount: totalCashbackIn }, // using grouped cashback/inflows
    { label: 'Transfer Masuk / Mutasi', amount: totalTransferIn },
    { label: 'Penerimaan Refund / Batal', amount: totalRefundIn },
    { label: 'Penyesuaian Saldo Masuk', amount: totalAdjustmentIn },
    { label: 'Penerimaan Lainnya', amount: totalOtherIn },
  ].filter(item => item.amount > 0)

  const outflows = [
    { label: 'Pembayaran Pembelian Stok', amount: totalStockPurchase },
    { label: 'Pengeluaran Operasional / Umum', amount: totalPaymentOut },
    { label: 'Pengeluaran Refund / Batal', amount: totalRefundOut },
    { label: 'Pengeluaran Cashback', amount: totalCashbackOut },
    { label: 'Transfer Keluar / Mutasi', amount: totalTransferOut },
    { label: 'Penyesuaian Saldo Keluar', amount: totalAdjustmentOut },
    { label: 'Pengeluaran Lainnya', amount: totalOtherOut },
  ].filter(item => item.amount > 0)

  const handleExportCSV = () => {
    if (filteredEntries.length === 0) return

    const headers = ['Tanggal', 'Rekening', 'Tipe Transaksi', 'Keterangan', 'Jumlah (IDR)']
    const rows = filteredEntries.map(entry => [
      new Date(entry.created_at).toLocaleString('id-ID'),
      entry.account?.name || '-',
      entry.transaction_type,
      entry.description || '-',
      entry.amount
    ])

    // Use BOM for Excel compatibility in UTF-8
    const csvContent = "\uFEFF" + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `arus-kas-${MONTHS[selectedMonth]}-${selectedYear}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Arus Kas (Cash Flow)</h1>
          <p className="text-sm text-slate-500 mt-0.5">Laporan pergerakan kas masuk dan keluar aktual (Cash Basis).</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button 
              onClick={() => {
                setIsMonthDropdownOpen(!isMonthDropdownOpen)
                setIsYearDropdownOpen(false)
              }}
              className="inline-flex items-center justify-between gap-2 px-3 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 min-w-[140px] shadow-sm cursor-pointer"
            >
              <span>{MONTHS[selectedMonth]}</span>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>
            {isMonthDropdownOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-44 bg-white border border-slate-100 rounded-xl shadow-lg z-20 max-h-60 overflow-y-auto py-1">
                {MONTHS.map((m, idx) => (
                  <button
                    key={m}
                    onClick={() => {
                      setSelectedMonth(idx)
                      setIsMonthDropdownOpen(false)
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 font-medium ${selectedMonth === idx ? 'text-blue-600 bg-blue-50/50' : 'text-slate-700'}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button 
              onClick={() => {
                setIsYearDropdownOpen(!isYearDropdownOpen)
                setIsMonthDropdownOpen(false)
              }}
              className="inline-flex items-center justify-between gap-2 px-3 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 min-w-[90px] shadow-sm cursor-pointer"
            >
              <span>{selectedYear}</span>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>
            {isYearDropdownOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-28 bg-white border border-slate-100 rounded-xl shadow-lg z-20 py-1">
                {YEARS.map(y => (
                  <button
                    key={y}
                    onClick={() => {
                      setSelectedYear(y)
                      setIsYearDropdownOpen(false)
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 font-medium ${selectedYear === y ? 'text-blue-600 bg-blue-50/50' : 'text-slate-700'}`}
                  >
                    {y}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button 
            onClick={handleExportCSV}
            disabled={filteredEntries.length === 0}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 text-rose-600 text-sm font-medium rounded-xl border border-rose-100 shadow-sm">
          {error}
        </div>
      )}

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-100 shadow-sm rounded-xl px-6 py-5 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Kas Masuk</span>
            <div className="h-8 w-8 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-black text-emerald-600 tracking-tight">
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin text-slate-300" /> : formatRupiah(cashIn)}
            </h3>
          </div>
        </div>

        <div className="bg-white border border-slate-100 shadow-sm rounded-xl px-6 py-5 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Kas Keluar</span>
            <div className="h-8 w-8 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center">
              <ArrowDownRight className="h-4 w-4" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-black text-rose-600 tracking-tight">
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin text-slate-300" /> : formatRupiah(cashOut)}
            </h3>
          </div>
        </div>

        <div className="bg-white border border-slate-100 shadow-sm rounded-xl px-6 py-5 flex flex-col justify-between border-b-4 border-b-blue-600 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-blue-600 uppercase tracking-wider">Kenaikan Kas Bersih</span>
            <div className="h-8 w-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
              <Wallet className="h-4 w-4" />
            </div>
          </div>
          <div>
            <h3 className={`text-3xl font-black tracking-tight ${netCashflow >= 0 ? 'text-slate-800' : 'text-rose-600'}`}>
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin text-slate-300" /> : formatRupiah(netCashflow)}
            </h3>
          </div>
        </div>
      </div>

      {/* Structured Cashflow Statement & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
        {/* Breakdown Card */}
        <div className="lg:col-span-1 bg-white border border-slate-100 shadow-sm rounded-xl overflow-hidden h-fit">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-base font-bold text-slate-800">Rincian Arus Kas</h2>
          </div>
          <div className="p-6 space-y-6">
            {isLoading ? (
              <div className="py-12 flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <>
                {/* INFLOWS */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Penerimaan Kas
                  </h3>
                  {inflows.length === 0 ? (
                    <p className="text-sm text-slate-400 pl-3">Tidak ada kas masuk.</p>
                  ) : (
                    <div className="space-y-3 pl-3">
                      {inflows.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                          <span className="text-slate-500 font-medium">{item.label}</span>
                          <span className="text-slate-900 font-semibold">{formatRupiah(item.amount)}</span>
                        </div>
                      ))}
                      <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-sm font-bold">
                        <span className="text-slate-800">Total Masuk</span>
                        <span className="text-emerald-600">{formatRupiah(cashIn)}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* OUTFLOWS */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    Pengeluaran Kas
                  </h3>
                  {outflows.length === 0 ? (
                    <p className="text-sm text-slate-400 pl-3">Tidak ada kas keluar.</p>
                  ) : (
                    <div className="space-y-3 pl-3">
                      {outflows.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                          <span className="text-slate-500 font-medium">{item.label}</span>
                          <span className="text-slate-900 font-semibold">({formatRupiah(item.amount)})</span>
                        </div>
                      ))}
                      <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-sm font-bold">
                        <span className="text-slate-800">Total Keluar</span>
                        <span className="text-rose-600">({formatRupiah(cashOut)})</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* SUMMARY ROW */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between font-bold text-slate-950">
                  <span className="text-sm">Net Perubahan Kas</span>
                  <span className={`text-base ${netCashflow >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {netCashflow >= 0 ? '+' : ''}{formatRupiah(netCashflow)}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Transactions List */}
        <div className="lg:col-span-2 bg-white border border-slate-100 shadow-sm rounded-xl overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-base font-bold text-slate-800">Riwayat Transaksi Kas</h2>
            <div className="relative w-full sm:w-64">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari transaksi..."
                className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 placeholder-slate-400 bg-white"
              />
            </div>
          </div>

          <div className="flex-1 overflow-x-auto">
            {isLoading ? (
              <div className="py-24 flex justify-center items-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : filteredEntries.length === 0 ? (
              <div className="py-24 text-center text-sm text-slate-400">
                Tidak ada transaksi kas untuk periode ini.
              </div>
            ) : (
              <table className="min-w-full divide-y divide-slate-100 text-sm">
                <thead className="bg-slate-50/60 sticky top-0">
                  <tr>
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Tanggal</th>
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Rekening</th>
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Tipe</th>
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Keterangan</th>
                    <th scope="col" className="px-6 py-3.5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Jumlah</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {filteredEntries.map((entry) => {
                    const isPositive = Number(entry.amount) > 0
                    
                    let badgeColor = 'bg-slate-100 text-slate-700 border-slate-200'
                    let label = entry.transaction_type
                    
                    switch (entry.transaction_type) {
                      case 'PAYMENT_IN':
                        badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-100'
                        label = 'Penjualan'
                        break
                      case 'STOCK_PURCHASE':
                        badgeColor = 'bg-rose-50 text-rose-700 border-rose-100'
                        label = 'Beli Stok'
                        break
                      case 'PAYMENT_OUT':
                        badgeColor = 'bg-red-50 text-red-700 border-red-100'
                        label = 'Pengeluaran'
                        break
                      case 'REFUND':
                        badgeColor = 'bg-orange-50 text-orange-700 border-orange-100'
                        label = 'Refund'
                        break
                      case 'CASHBACK':
                        badgeColor = 'bg-amber-50 text-amber-700 border-amber-100'
                        label = 'Cashback'
                        break
                      case 'TRANSFER_IN':
                      case 'TRANSFER_OUT':
                        badgeColor = 'bg-blue-50 text-blue-700 border-blue-100'
                        label = 'Mutasi Kas'
                        break
                      case 'ADJUSTMENT':
                        badgeColor = 'bg-slate-50 text-slate-700 border-slate-200'
                        label = 'Penyesuaian'
                        break
                    }

                    return (
                      <tr key={entry.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-slate-500 text-xs font-semibold">
                          {new Date(entry.created_at).toLocaleString('id-ID', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-slate-700 font-semibold text-xs">
                          {entry.account?.name || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-0.5 border rounded-full text-[10px] font-bold ${badgeColor}`}>
                            {label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-600 font-medium text-xs max-w-xs truncate" title={entry.description}>
                          {entry.description || '-'}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-right font-bold text-xs font-mono ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {isPositive ? '+' : ''}{formatRupiah(Number(entry.amount))}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
