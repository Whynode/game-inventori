import { createClient } from '../../lib/supabase/server'
import { redirect } from 'next/navigation'
import { FileText, CheckCircle, Store, Coins, TrendingUp } from 'lucide-react'

export default async function DashboardOverview() {
 const supabase = await createClient()

 const { data: { user } } = await supabase.auth.getUser()

 if (!user) {
 redirect('/login')
 }

 // Fetch counts safely
 let unpostedCount = 0
 let availableCount = 0
 let soldCount = 0
 let totalRevenue = 0
 let totalProfit = 0

 try {
 const [unpostedRes, availableRes, soldRes, financialsRes] = await Promise.all([
 supabase.from('inventory').select('*', { count: 'exact', head: true }).eq('status', 'UNPOSTED'),
 supabase.from('inventory').select('*', { count: 'exact', head: true }).eq('status', 'AVAILABLE'),
 supabase.from('inventory').select('*', { count: 'exact', head: true }).eq('status', 'SOLD'),
 supabase.from('inventory').select('sold_price, capital_price').eq('status', 'SOLD')
 ])

 unpostedCount = unpostedRes.count || 0
 availableCount = availableRes.count || 0
 soldCount = soldRes.count || 0

 if (financialsRes.data) {
 financialsRes.data.forEach(item => {
 const sold = item.sold_price || 0
 const capital = item.capital_price || 0
 totalRevenue += sold
 totalProfit += (sold - capital)
 })
 }
 } catch (error) {
 console.error('Error fetching inventory counts:', error)
 }

 const formatCurrency = (amount: number) => {
 return new Intl.NumberFormat('id-ID', {
 style: 'currency',
 currency: 'IDR',
 minimumFractionDigits: 0,
 maximumFractionDigits: 0
 }).format(amount)
 }

 return (
 <div className="max-w-6xl mx-auto space-y-8">
 <div>
 <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Selamat datang kembali!</h1>
 <p className="text-sm text-slate-500 mt-1">Berikut ringkasan performa bisnis akun game kamu hari ini.</p>
 </div>

 {/* Metrics Grid */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 
 {/* Card 1: UNPOSTED */}
 <div className="bg-white p-5 rounded-lg border border-slate-200 flex flex-col justify-between">
 <div className="flex items-center space-x-3 mb-3">
 <FileText className="h-5 w-5 text-slate-500" />
 <p className="text-sm font-medium text-slate-600">Belum Posting</p>
 </div>
 <h3 className="text-2xl font-bold text-slate-900">{unpostedCount}</h3>
 </div>

 {/* Card 2: AVAILABLE */}
 <div className="bg-white p-5 rounded-lg border border-slate-200 flex flex-col justify-between">
 <div className="flex items-center space-x-3 mb-3">
 <Store className="h-5 w-5 text-blue-500" />
 <p className="text-sm font-medium text-slate-600">Siap Jual</p>
 </div>
 <h3 className="text-2xl font-bold text-slate-900">{availableCount}</h3>
 </div>

 {/* Card 3: SOLD */}
 <div className="bg-white p-5 rounded-lg border border-slate-200 flex flex-col justify-between">
 <div className="flex items-center space-x-3 mb-3">
 <CheckCircle className="h-5 w-5 text-emerald-500" />
 <p className="text-sm font-medium text-slate-600">Laku Terjual</p>
 </div>
 <h3 className="text-2xl font-bold text-slate-900">{soldCount}</h3>
 </div>

 </div>

 {/* Financials Grid */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 {/* Revenue */}
 <div className="bg-white p-5 rounded-lg border border-slate-200 flex flex-col justify-between">
 <div className="flex items-center space-x-3 mb-3">
 <Coins className="h-5 w-5 text-emerald-600" />
 <p className="text-sm font-medium text-slate-600">Total Pendapatan</p>
 </div>
 <h3 className="text-2xl font-bold text-slate-900">{formatCurrency(totalRevenue)}</h3>
 </div>

 {/* Profit */}
 <div className="bg-white p-5 rounded-lg border border-slate-200 flex flex-col justify-between">
 <div className="flex items-center space-x-3 mb-3">
 <TrendingUp className="h-5 w-5 text-blue-500" />
 <p className="text-sm font-medium text-slate-600">Keuntungan Bersih</p>
 </div>
 <h3 className="text-2xl font-bold text-slate-900">{formatCurrency(totalProfit)}</h3>
 </div>
 </div>
 </div>
 )
}
