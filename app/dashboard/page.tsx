import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Store, CheckCircle, Clock, Wallet, TrendingUp, CreditCard, RefreshCw, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react'
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
    <div className="max-w-6xl mx-auto h-[calc(100vh-5rem)] overflow-hidden flex flex-col pb-4">
      <div className="flex-shrink-0 mb-8 mt-2">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
        <p className="text-sm text-slate-500 mt-0.5">Ringkasan performa bisnis dan keuangan real-time.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-3 gap-4 flex-1 min-h-0">
        {/* ROW 1 */}
        {/* 1. Total Saldo Kas (Premium Gradient) */}
        <div className="col-span-1 row-span-1 bg-gradient-to-br from-slate-900 to-slate-800 p-4 rounded-2xl shadow-sm flex flex-col justify-between text-white relative overflow-hidden h-full">
          <svg className="absolute bottom-0 left-0 w-full h-1/2 opacity-20 pointer-events-none" viewBox="0 0 100 50" preserveAspectRatio="none">
            <path d="M0,50 L0,40 C20,30 30,45 50,20 C70,-5 80,30 100,10 L100,50 Z" fill="url(#spark-grad)"/>
            <defs>
              <linearGradient id="spark-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4ade80" />
                <stop offset="100%" stopColor="#4ade80" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
          <div className="relative z-10 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-300">Total Saldo Kas</span>
            <Wallet className="h-4 w-4 text-slate-400" />
          </div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold tracking-tight">{formatRupiah(totalBalance)}</h3>
            <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-medium border border-emerald-500/20">
              <TrendingUp className="h-3 w-3" />
              +12.5% vs bulan lalu
            </div>
          </div>
        </div>

        {/* 2. Chart Arus Kas */}
        <div className="col-span-1 md:col-span-2 row-span-1 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden h-full">
          <div className="flex items-center justify-between flex-shrink-0 z-10 relative bg-white/80 backdrop-blur-sm pb-1">
            <div>
              <h2 className="text-sm font-bold text-slate-800">Arus Kas</h2>
              <p className="text-[10px] text-slate-500 mt-0.5">7 Hari Terakhir</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-emerald-600">+ Rp 4.2M</p>
              <p className="text-[10px] text-slate-400">Net Flow</p>
            </div>
          </div>
          
          <div className="flex-1 flex items-end justify-between gap-3 mt-2 h-full">
            {[30, 50, 40, 70, 45, 80, 60].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end items-center gap-1.5 h-full group">
                <div className="w-full bg-blue-50/50 rounded-t-md relative overflow-hidden flex items-end h-full">
                  <div className="w-full bg-blue-500 rounded-t-md transition-all duration-500 group-hover:bg-blue-600" style={{ height: `${h}%` }}></div>
                </div>
                <span className="text-[9px] text-slate-400 font-medium leading-none">
                  {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Total Omzet */}
        <div className="col-span-1 row-span-1 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden group h-full">
          <svg className="absolute bottom-0 left-0 w-full h-1/2 opacity-[0.03] pointer-events-none group-hover:opacity-10 transition-opacity" viewBox="0 0 100 50" preserveAspectRatio="none">
            <polyline points="0,40 20,45 40,30 60,35 80,10 100,20" fill="none" stroke="#0ea5e9" strokeWidth="2" />
          </svg>
          <div className="flex items-center justify-between z-10 relative">
            <span className="text-xs font-medium text-slate-500">Total Omzet</span>
            <TrendingUp className="h-4 w-4 text-slate-300" />
          </div>
          <div className="z-10 relative">
            <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{formatRupiah(financials.omzet)}</h3>
            <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-medium border border-emerald-100">
              <ArrowUpRight className="h-3 w-3" />
              +8.2%
            </div>
          </div>
        </div>

        {/* ROW 2 & 3 */}
        
        {/* 4. Aktivitas Keuangan (spans 2 rows, 2 cols) */}
        <div className="col-span-1 md:col-span-2 row-span-2 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
          <div className="flex items-center justify-between mb-3 flex-shrink-0">
            <h2 className="text-sm font-bold text-slate-800">Aktivitas Keuangan Terbaru</h2>
            <span className="text-[10px] text-blue-600 font-semibold cursor-pointer hover:underline bg-blue-50 px-2 py-1 rounded-full">Lihat Semua</span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {recentLedger.length > 0 ? (
              recentLedger.map((tx: any) => {
                const isPositive = tx.amount > 0
                return (
                  <div key={tx.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0 group">
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center justify-center ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">
                          {tx.transaction_type.replace(/_/g, ' ')}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {tx.accounts?.name || 'Unknown Account'} • {formatDate(tx.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className={`text-sm font-bold tracking-tight ${isPositive ? 'text-emerald-600' : 'text-slate-700'}`}>
                      {isPositive ? '+' : ''}{formatRupiah(tx.amount)}
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-center text-slate-400 text-xs py-8">Belum ada aktivitas keuangan.</div>
            )}
          </div>
        </div>

        {/* 5. Total Profit */}
        <div className="col-span-1 row-span-1 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden group h-full">
          <svg className="absolute bottom-0 left-0 w-full h-1/2 opacity-[0.03] pointer-events-none group-hover:opacity-10 transition-opacity" viewBox="0 0 100 50" preserveAspectRatio="none">
            <path d="M0,50 L0,30 Q25,50 50,20 T100,10 L100,50 Z" fill="#6366f1"/>
          </svg>
          <div className="flex items-center justify-between z-10 relative">
            <span className="text-xs font-medium text-slate-500">Total Profit</span>
            <Activity className="h-4 w-4 text-slate-300" />
          </div>
          <div className="z-10 relative">
            <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{formatRupiah(financials.profit)}</h3>
            <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-medium border border-emerald-100">
              <ArrowUpRight className="h-3 w-3" />
              +5.4%
            </div>
          </div>
        </div>

        {/* 6. Total Piutang */}
        <div className="col-span-1 row-span-1 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden group h-full">
          <svg className="absolute bottom-0 left-0 w-full h-1/2 opacity-[0.03] pointer-events-none group-hover:opacity-10 transition-opacity" viewBox="0 0 100 50" preserveAspectRatio="none">
            <path d="M0,50 L0,40 Q25,20 50,40 T100,20 L100,50 Z" fill="#f97316"/>
          </svg>
          <div className="flex items-center justify-between z-10 relative">
            <span className="text-xs font-medium text-slate-500">Total Piutang</span>
            <CreditCard className="h-4 w-4 text-slate-300" />
          </div>
          <div className="z-10 relative">
            <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{formatRupiah(financials.piutang)}</h3>
            <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 text-[10px] font-medium border border-orange-100">
              <ArrowDownRight className="h-3 w-3" />
              -2.1%
            </div>
          </div>
        </div>

        {/* 7. Status Inventori (spans 2 cols) */}
        <div className="col-span-1 md:col-span-2 row-span-1 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-full">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-slate-800">Status Inventori</h2>
            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-full">Total Stok: {inventory.total}</span>
          </div>
          <div className="grid grid-cols-4 gap-2 flex-1">
            <div className="flex flex-col items-center justify-center p-2 bg-slate-50 rounded-xl border border-slate-100 transition-colors hover:bg-white hover:shadow-sm hover:border-slate-200 cursor-pointer">
              <Store className="h-4 w-4 text-blue-500 mb-1.5" />
              <span className="text-lg font-bold text-slate-800">{inventory.available}</span>
              <span className="text-[9px] text-slate-500 font-medium mt-0.5">Tersedia</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 bg-slate-50 rounded-xl border border-slate-100 transition-colors hover:bg-white hover:shadow-sm hover:border-slate-200 cursor-pointer">
              <Clock className="h-4 w-4 text-orange-500 mb-1.5" />
              <span className="text-lg font-bold text-slate-800">{inventory.booked}</span>
              <span className="text-[9px] text-slate-500 font-medium mt-0.5">Booking</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 bg-slate-50 rounded-xl border border-slate-100 transition-colors hover:bg-white hover:shadow-sm hover:border-slate-200 cursor-pointer">
              <CheckCircle className="h-4 w-4 text-emerald-500 mb-1.5" />
              <span className="text-lg font-bold text-slate-800">{inventory.sold}</span>
              <span className="text-[9px] text-slate-500 font-medium mt-0.5">Terjual</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 bg-slate-50 rounded-xl border border-slate-100 transition-colors hover:bg-white hover:shadow-sm hover:border-slate-200 cursor-pointer">
              <RefreshCw className="h-4 w-4 text-slate-400 mb-1.5" />
              <span className="text-lg font-bold text-slate-800">{inventory.other}</span>
              <span className="text-[9px] text-slate-500 font-medium mt-0.5">Lainnya</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
