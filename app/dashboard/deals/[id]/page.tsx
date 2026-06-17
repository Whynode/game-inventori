import { getDealById } from '@/actions/deals'
import { getAccounts } from '@/actions/accounts'
import { DealDetailHeader } from './DealDetailHeader'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { PaymentWithRelations, DealStatus } from '@/types/database'
import { formatRupiah, formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function DealDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [{ data: deal, error: dealError }, { data: accounts }] = await Promise.all([
    getDealById(id),
    getAccounts()
  ])

  if (dealError || !deal) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-600 p-4 rounded-[10px] shadow-sm border border-red-100">
          Failed to load deal details: {dealError || 'Not found'}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto min-h-screen bg-gray-50/50 space-y-6">
      <DealDetailHeader 
        dealId={deal.id} 
        stockId={deal.stock_id}
        status={deal.status as DealStatus}
        remainingBalance={deal.remaining_balance} 
        accounts={accounts || []} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Deal Summary Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[10px] shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Deal Overview</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Deal Number</p>
                <p className="text-base font-semibold text-gray-900 font-mono mt-1">{deal.deal_number}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <div className="mt-1">
                  <StatusBadge status={deal.status as any} />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Customer</p>
                <p className="text-base font-semibold text-gray-900 mt-1">{deal.customer_name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Contact</p>
                <p className="text-base font-semibold text-gray-900 mt-1">{deal.customer_contact || '-'}</p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-[10px] border border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Stock Linked</span>
                <span className="text-sm font-semibold text-gray-900">{deal.stock?.name} ({deal.stock?.category})</span>
              </div>
            </div>
          </div>

          {/* Historical Payments Table */}
          <div className="bg-white rounded-[10px] shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Payment History</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Method/Account</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Notes</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {deal.payments && deal.payments.length > 0 ? (
                    deal.payments.map((payment: PaymentWithRelations) => (
                      <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(payment.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {payment.account?.name || 'Unknown Account'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-emerald-600 font-bold">
                          + {formatRupiah(payment.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {payment.notes || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-[10px] text-xs font-medium bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200/50">
                            {payment.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500">
                        No payments recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Financial Summary Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-[10px] shadow-sm border border-gray-200 p-6 sticky top-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Financial Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">Deal Price</span>
                <span className="font-mono font-medium text-gray-900">{formatRupiah(deal.deal_price)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">Total Paid</span>
                <span className="font-mono font-bold text-emerald-600">{formatRupiah(deal.total_paid)}</span>
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">Remaining Balance</span>
                  <span className={`font-mono font-bold text-lg ${deal.remaining_balance > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                    {formatRupiah(deal.remaining_balance)}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                 <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment Progress</span>
                    <span className="text-sm font-bold text-blue-600">{deal.payment_percentage.toFixed(0)}%</span>
                 </div>
                 <div className="w-full bg-gray-100 rounded-[10px] h-2.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-[10px] transition-all duration-1000 ease-out ${deal.payment_percentage >= 100 ? 'bg-emerald-500' : 'bg-blue-600'}`} 
                      style={{ width: `${Math.min(deal.payment_percentage, 100)}%` }}
                    ></div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
