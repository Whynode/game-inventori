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
    getRecentLedger(3)
  ])

  const totalBalance = balanceRes.data || 0
  const inventory = inventoryRes.data || { available: 0, sold: 0, booked: 0, other: 0, total: 0 }
  const financials = financialRes.data || { omzet: 0, profit: 0, piutang: 0 }
  const recentLedger = ledgerRes.data || []


  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-6rem)] overflow-hidden flex flex-col space-y-3 pb-0">
      <div className="flex-shrink-0">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Dashboard Overview</h1>
        <p className="text-base text-slate-500 mt-0.5">Ringkasan performa bisnis dan keuangan real-time.</p>
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 flex-shrink-0">
        <div className="bg-white p-3 rounded-[10px] border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-slate-500">Total Saldo Kas</p>
            <div className="p-1.5 bg-blue-50/50 rounded-[6px]">
              <Wallet className="h-4 w-4 text-blue-600" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">{formatRupiah(totalBalance)}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Semua Rekening Aktif</p>
          </div>
        </div>

        <div className="bg-white p-3 rounded-[10px] border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-slate-500">Total Omzet</p>
            <div className="p-1.5 bg-emerald-50/50 rounded-[6px]">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">{formatRupiah(financials.omzet)}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Pendapatan Kotor</p>
          </div>
        </div>

        <div className="bg-white p-3 rounded-[10px] border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-slate-500">Total Profit</p>
            <div className="p-1.5 bg-indigo-50/50 rounded-[6px]">
              <Activity className="h-4 w-4 text-indigo-600" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">{formatRupiah(financials.profit)}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Keuntungan Bersih</p>
          </div>
        </div>

        <div className="bg-white p-3 rounded-[10px] border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-slate-500">Total Piutang</p>
            <div className="p-1.5 bg-orange-50/50 rounded-[6px]">
              <CreditCard className="h-4 w-4 text-orange-600" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">{formatRupiah(financials.piutang)}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Menunggu Pembayaran</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 flex-1 min-h-0">
        {/* Inventory Stats */}
        <div className="lg:col-span-1 h-full">
          <div className="bg-white p-3 rounded-[10px] border border-slate-100 shadow-sm h-full flex flex-col">
            <h2 className="text-sm font-semibold text-slate-800 mb-3 flex-shrink-0">Status Inventori</h2>
            <div className="space-y-2 flex-1 overflow-auto pr-1">
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-[6px]">
                <div className="flex items-center space-x-2.5">
                  <Store className="h-3.5 w-3.5 text-blue-500" />
                  <span className="text-xs text-slate-500">Tersedia</span>
                </div>
                <span className="text-sm font-extrabold text-slate-800">{inventory.available}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-[6px]">
                <div className="flex items-center space-x-2.5">
                  <Clock className="h-3.5 w-3.5 text-orange-500" />
                  <span className="text-xs text-slate-500">Di-booking</span>
                </div>
                <span className="text-sm font-extrabold text-slate-800">{inventory.booked}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-[6px]">
                <div className="flex items-center space-x-2.5">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-xs text-slate-500">Terjual</span>
                </div>
                <span className="text-sm font-extrabold text-slate-800">{inventory.sold}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-[6px]">
                <div className="flex items-center space-x-2.5">
                  <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
                  <span className="text-xs text-slate-500">Lainnya</span>
                </div>
                <span className="text-sm font-extrabold text-slate-800">{inventory.other}</span>
              </div>
              <div className="pt-2.5 border-t border-slate-100 flex justify-between items-center mt-auto flex-shrink-0">
                <span className="text-xs font-medium text-slate-500">Total Stok</span>
                <span className="text-sm font-extrabold text-slate-800">{inventory.total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Ledger */}
        <div className="lg:col-span-2 h-full">
          <div className="bg-white rounded-[10px] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-3 border-b border-slate-100 flex-shrink-0">
              <h2 className="text-sm font-semibold text-slate-800">Aktivitas Keuangan Terbaru</h2>
            </div>
            <div className="flex-1 overflow-auto">
              {recentLedger.length > 0 ? (
                <div className="divide-y divide-slate-50">
                  {recentLedger.slice(0, 3).map((tx: any) => {
                    const isPositive = tx.amount > 0
                    return (
                      <div key={tx.id} className="px-3 py-2 hover:bg-slate-50 transition-colors flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-1.5 rounded-[6px] ${isPositive ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                            {isPositive ? (
                              <ArrowUpRight className={`h-3.5 w-3.5 text-emerald-600`} />
                            ) : (
                              <ArrowDownRight className={`h-3.5 w-3.5 text-rose-600`} />
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-800">
                              {tx.transaction_type.replace(/_/g, ' ')}
                            </p>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {tx.accounts?.name || 'Unknown Account'} • {formatDate(tx.created_at)}
                            </p>
                            {tx.description && (
                              <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1 max-w-xs">{tx.description}</p>
                            )}
                          </div>
                        </div>
                        <div className={`text-sm font-bold tracking-tight ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {isPositive ? '+' : ''}{formatRupiah(tx.amount)}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="p-6 text-center text-slate-500 text-xs">
                  Belum ada aktivitas keuangan.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
