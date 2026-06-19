import { getStocks } from '@/actions/stocks'
import { StockTable } from '@/components/inventory/StockTable'
import { InventoryHeader } from './InventoryHeader'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function InventoryPage() {
  const supabase = await createClient()
  
  // Fetch stocks and categories in parallel
  const [stocksResult, categoriesResult] = await Promise.all([
    getStocks(),
    supabase.from('games').select('*').order('name', { ascending: true })
  ])

  const stocks = stocksResult.data || []
  const error = stocksResult.error
  const categories = categoriesResult.data || []

  return (
    <div className="max-w-[1600px] mx-auto h-[calc(100vh-5rem)] flex flex-col overflow-hidden bg-gray-50/50 p-4 md:p-6 pb-4">
      <div className="flex-shrink-0">
        <InventoryHeader categories={categories} />
      </div>

      {error ? (
        <div className="bg-red-50 text-red-700 p-6 rounded-[10px] border border-red-100 flex items-start shadow-sm">
          <span className="text-xl mr-3">⚠️</span>
          <div>
            <h3 className="font-bold text-red-900">Failed to load inventory</h3>
            <p className="text-sm mt-1 opacity-90">{error}</p>
          </div>
        </div>
      ) : (
        <StockTable stocks={stocks} categories={categories} />
      )}
    </div>
  )
}
