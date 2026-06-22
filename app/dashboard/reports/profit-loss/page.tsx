'use client'

import React, { useState, useEffect } from 'react'
import { Calendar, Download, ChevronDown, TrendingUp, TrendingDown, Activity, ArrowUpRight, ArrowDownRight, Loader2 } from 'lucide-react'
import { formatRupiah } from '@/lib/utils'
import { getProfitLossReport } from '@/app/actions/reports'

export default function ProfitLossPage() {
  const [reportData, setReportData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    const data = await getProfitLossReport()
    setReportData(data)
    setIsLoading(false)
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!reportData) {
    return (
      <div className="max-w-6xl mx-auto flex items-center justify-center min-h-[60vh]">
        <p className="text-slate-500">Gagal memuat laporan laba rugi.</p>
      </div>
    )
  }

  const grossProfit = reportData.revenue - reportData.cogs
  const totalExpenses = reportData.breakdown.expenses.slice(1).reduce((acc: number, curr: any) => acc + curr.amount, 0)

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Laba Rugi (Profit & Loss)</h1>
          <p className="text-sm text-slate-500 mt-0.5">Analisis pendapatan, beban pokok penjualan, dan laba bersih bisnis.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center justify-between gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 w-full sm:w-auto shadow-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span>Semua Waktu</span>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400 ml-2" />
          </button>
          <button className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm">
            <Download className="h-4 w-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-100 shadow-sm rounded-xl px-6 py-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Pendapatan</span>
            <div className="h-8 w-8 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
               <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{formatRupiah(reportData.revenue)}</h3>
          </div>
        </div>

        <div className="bg-white border border-slate-100 shadow-sm rounded-xl px-6 py-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total HPP / Modal Stok</span>
            <div className="h-8 w-8 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center">
               <TrendingDown className="h-4 w-4" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{formatRupiah(reportData.cogs)}</h3>
          </div>
        </div>

        <div className="bg-white border border-slate-100 shadow-sm rounded-xl px-6 py-5 flex flex-col justify-between border-b-4 border-b-blue-500">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-blue-600 uppercase tracking-wider">Laba Bersih</span>
            <div className="h-8 w-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
               <Activity className="h-4 w-4" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-blue-700 tracking-tight">{formatRupiah(reportData.netProfit)}</h3>
          </div>
        </div>
      </div>

      {/* Structured P&L Table */}
      <div className="bg-white border border-slate-100 shadow-sm rounded-xl overflow-hidden mt-2">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-base font-bold text-slate-800">Rincian Laba Rugi</h2>
        </div>
        
        <div className="p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* PENDAPATAN */}
            <div>
              <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                <ArrowUpRight className="h-4 w-4" /> Pendapatan (Revenue)
              </h3>
              <div className="bg-slate-50 border border-slate-100 rounded-lg divide-y divide-slate-100">
                {reportData.breakdown.income.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm font-medium text-slate-700">{item.label}</span>
                    <span className="text-sm font-semibold text-slate-900">{formatRupiah(item.amount)}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between px-4 py-3 bg-white rounded-b-lg border-t-2 border-slate-200">
                  <span className="text-sm font-bold text-slate-900">Total Pendapatan</span>
                  <span className="text-sm font-bold text-emerald-600">{formatRupiah(reportData.revenue)}</span>
                </div>
              </div>
            </div>

            {/* HPP */}
            <div>
              <h3 className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                <ArrowDownRight className="h-4 w-4" /> Harga Pokok Penjualan (HPP)
              </h3>
              <div className="bg-slate-50 border border-slate-100 rounded-lg divide-y divide-slate-100">
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm font-medium text-slate-700">{reportData.breakdown.expenses[0].label}</span>
                  <span className="text-sm font-semibold text-slate-900">({formatRupiah(reportData.breakdown.expenses[0].amount)})</span>
                </div>
                <div className="flex items-center justify-between px-4 py-3 bg-white rounded-b-lg border-t-2 border-slate-200">
                  <span className="text-sm font-bold text-slate-900">Total HPP</span>
                  <span className="text-sm font-bold text-rose-600">({formatRupiah(reportData.cogs)})</span>
                </div>
              </div>
            </div>

            {/* LABA KOTOR */}
            <div className="flex items-center justify-between px-4 py-4 bg-blue-50/50 border border-blue-100 rounded-lg">
              <span className="text-base font-bold text-slate-800">Laba Kotor (Gross Profit)</span>
              <span className="text-lg font-bold text-blue-700">{formatRupiah(grossProfit)}</span>
            </div>

            {/* BEBAN OPERASIONAL */}
            <div>
              <h3 className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                <ArrowDownRight className="h-4 w-4" /> Beban Operasional & Lainnya
              </h3>
              <div className="bg-slate-50 border border-slate-100 rounded-lg divide-y divide-slate-100">
                {reportData.breakdown.expenses.slice(1).map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm font-medium text-slate-700">{item.label}</span>
                    <span className="text-sm font-semibold text-slate-900">({formatRupiah(item.amount)})</span>
                  </div>
                ))}
                <div className="flex items-center justify-between px-4 py-3 bg-white rounded-b-lg border-t-2 border-slate-200">
                  <span className="text-sm font-bold text-slate-900">Total Beban</span>
                  <span className="text-sm font-bold text-orange-600">({formatRupiah(totalExpenses)})</span>
                </div>
              </div>
            </div>

            {/* LABA BERSIH */}
            <div className="flex items-center justify-between px-6 py-5 bg-slate-900 rounded-xl shadow-md mt-4">
              <span className="text-lg font-bold text-white tracking-wide">Laba Bersih (Net Profit)</span>
              <span className="text-2xl font-bold text-emerald-400 tracking-tight">{formatRupiah(reportData.netProfit)}</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

