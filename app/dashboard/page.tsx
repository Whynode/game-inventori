import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Store, CheckCircle, Clock, Wallet, TrendingUp, CreditCard, RefreshCw, Activity, ArrowUpRight, ArrowDownRight, PieChart, LineChart } from 'lucide-react'
import { getTotalBalance, getInventoryStats, getFinancialSummary, getRecentLedger } from '@/actions/analytics'
import { formatRupiah, formatDate } from '@/lib/utils'

export default async function DashboardOverview() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const [balanceRes, inventoryRes, financialRes, ledgerRes] = await Promise.all([
    getTotalBalance(),
    getInventoryStats(),
    getFinancialSummary(),
    getRecentLedger(7)
  ])

  const totalBalance = balanceRes.data || 0
  const inventory = inventoryRes.data || { available: 0, sold: 0, booked: 0, other: 0, total: 0 }
  const financials = financialRes.data || { omzet: 0, profit: 0, piutang: 0 }
  const recentLedger = ledgerRes.data || []

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Command Center</h1>
        <p className="text-sm text-slate-500 mt-0.5">Ringkasan performa bisnis dan keuangan operasional.</p>
      </div>

      {/* 1. TOP METRICS (4 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* OMZET */}
        <div className="bg-white border border-slate-100 shadow-sm rounded-xl px-6 py-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Omzet</span>
            <TrendingUp className="h-4 w-4 text-slate-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{formatRupiah(financials.omzet)}</h3>
            <div className="mt-2 flex items-center text-xs">
              <span className="text-emerald-600 font-medium flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-0.5" /> +8.2%
              </span>
              <span className="text-slate-400 ml-2">vs bulan lalu</span>
            </div>
          </div>
        </div>

        {/* LABA BERSIH */}
        <div className="bg-white border border-slate-100 shadow-sm rounded-xl px-6 py-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Laba Bersih</span>
            <Activity className="h-4 w-4 text-slate-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{formatRupiah(financials.profit)}</h3>
            <div className="mt-2 flex items-center text-xs">
              <span className="text-emerald-600 font-medium flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-0.5" /> +5.4%
              </span>
              <span className="text-slate-400 ml-2">vs bulan lalu</span>
            </div>
          </div>
        </div>

        {/* KAS & BANK AKTIF */}
        <div className="bg-white border border-slate-100 shadow-sm rounded-xl px-6 py-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kas & Bank Aktif</span>
            <Wallet className="h-4 w-4 text-slate-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{formatRupiah(totalBalance)}</h3>
            <div className="mt-2 flex items-center text-xs">
              <span className="text-emerald-600 font-medium flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-0.5" /> +12.5%
              </span>
              <span className="text-slate-400 ml-2">vs bulan lalu</span>
            </div>
          </div>
        </div>

        {/* PIUTANG */}
        <div className="bg-white border border-slate-100 shadow-sm rounded-xl px-6 py-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Piutang</span>
            <CreditCard className="h-4 w-4 text-slate-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{formatRupiah(financials.piutang)}</h3>
            <div className="mt-2 flex items-center text-xs">
              <span className="text-orange-500 font-medium flex items-center">
                <ArrowDownRight className="h-3 w-3 mr-0.5" /> -2.1%
              </span>
              <span className="text-slate-400 ml-2">vs bulan lalu</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN VISUALIZATION (2-Column Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tren Pendapatan & Profit (Span 2/3) */}
        <div className="md:col-span-2 bg-white border border-slate-100 shadow-sm rounded-xl p-6 flex flex-col h-[360px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-slate-800">Tren Pendapatan & Profit</h2>
            <span className="text-xs font-medium text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">30 Hari Terakhir</span>
          </div>
          <div className="flex-1 flex items-center justify-center border border-dashed border-slate-200 rounded-lg bg-slate-50/50">
            <div className="text-center">
              <LineChart className="h-8 w-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-500">Area Chart Placeholder</p>
              <p className="text-xs text-slate-400 mt-1">Mockup grafik Revenue vs Profit</p>
            </div>
          </div>
        </div>

        {/* Status Inventori (Span 1/3) */}
        <div className="md:col-span-1 bg-white border border-slate-100 shadow-sm rounded-xl p-6 flex flex-col h-[360px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-slate-800">Status Inventori</h2>
            <span className="text-xs font-medium text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">Total: {inventory.total}</span>
          </div>
          
          <div className="flex-1 flex flex-col justify-between">
            {/* Donut Chart Placeholder */}
            <div className="flex-1 flex items-center justify-center mb-6">
               <div className="relative h-32 w-32 rounded-full border-[12px] border-slate-100 flex items-center justify-center border-t-emerald-500 border-r-blue-500 border-b-orange-500 border-l-rose-500">
                  <div className="text-center">
                     <span className="block text-xl font-bold text-slate-800">{inventory.total}</span>
                     <span className="block text-[10px] text-slate-500 font-medium">Stok</span>
                  </div>
               </div>
            </div>

            {/* Legend / List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                  <span className="text-slate-600 font-medium">Tersedia</span>
                </div>
                <span className="font-bold text-slate-800">{inventory.available}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                  <span className="text-slate-600 font-medium">Booking</span>
                </div>
                <span className="font-bold text-slate-800">{inventory.booked}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                  <span className="text-slate-600 font-medium">Terjual</span>
                </div>
                <span className="font-bold text-slate-800">{inventory.sold}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-rose-500"></div>
                  <span className="text-slate-600 font-medium">Bermasalah</span>
                </div>
                <span className="font-bold text-slate-800">{inventory.other}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM SECTION (Aktivitas Keuangan Terbaru) */}
      <div className="bg-white border border-slate-100 shadow-sm rounded-xl p-6 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-bold text-slate-800">Aktivitas Keuangan Terbaru</h2>
          <span className="text-xs font-semibold text-blue-600 cursor-pointer hover:bg-blue-50 px-3 py-1.5 rounded-full transition-colors">Lihat Semua Transaksi</span>
        </div>
        
        <div className="space-y-3">
          {recentLedger.length > 0 ? (
            recentLedger.map((tx: any) => {
              const isPositive = tx.amount > 0
              return (
                <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all group">
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-600'}`}>
                      {isPositive ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                        {tx.transaction_type.replace(/_/g, ' ')}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {tx.accounts?.name || 'Unknown Account'} • {formatDate(tx.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className={`text-base font-bold tracking-tight ${isPositive ? 'text-emerald-600' : 'text-slate-800'}`}>
                    {isPositive ? '+' : ''}{formatRupiah(tx.amount)}
                  </div>
                </div>
              )
            })
          ) : (
            <div className="text-center text-slate-400 text-sm py-10 border border-dashed border-slate-200 rounded-lg bg-slate-50">
              Belum ada aktivitas keuangan terbaru.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
