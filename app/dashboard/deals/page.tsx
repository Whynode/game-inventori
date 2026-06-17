import { getDeals } from '@/actions/deals'
import { DealTable } from '@/components/deals/DealTable'
import { DealsHeaderActions } from '@/components/deals/DealsHeaderActions'
import { FileText } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function DealsPage() {
  const { data: deals, error } = await getDeals()

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto min-h-screen bg-gray-50/50">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-[10px]">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Deals Management</h1>
            <p className="text-sm text-gray-500 mt-1">Manage customer transactions and split payments.</p>
          </div>
        </div>
        <DealsHeaderActions />
      </div>

      {error ? (
        <div className="bg-red-50 text-red-700 p-6 rounded-[10px] border border-red-100 flex items-start shadow-sm">
          <span className="text-xl mr-3">⚠️</span>
          <div>
            <h3 className="font-bold text-red-900">Failed to load deals</h3>
            <p className="text-sm mt-1 opacity-90">{error}</p>
          </div>
        </div>
      ) : (
        <DealTable deals={deals || []} />
      )}
    </div>
  )
}
