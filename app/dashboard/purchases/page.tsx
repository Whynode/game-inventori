import { getAccounts } from '@/actions/accounts'
import { StockPurchaseForm } from '@/components/purchases/StockPurchaseForm'

export const dynamic = 'force-dynamic'

export default async function PurchasesPage() {
  const { data: accounts, error } = await getAccounts()

  return (
    <div className="p-6 md:p-8 max-w-[1200px] mx-auto min-h-screen bg-gray-50/50">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Stock Purchase Module</h1>
        <p className="text-sm text-gray-500 mt-1">Record new inventory and automatically update the finance ledger.</p>
      </div>

      {error ? (
        <div className="bg-red-50 text-red-700 p-6 rounded-[10px] border border-red-100 flex items-start shadow-sm mb-6">
          <span className="text-xl mr-3">⚠️</span>
          <div>
            <h3 className="font-bold text-red-900">Failed to load accounts</h3>
            <p className="text-sm mt-1 opacity-90">{error}</p>
          </div>
        </div>
      ) : (
        <StockPurchaseForm accounts={accounts || []} />
      )}
    </div>
  )
}
