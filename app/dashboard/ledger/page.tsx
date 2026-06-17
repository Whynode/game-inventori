import { getLedgerEntries } from '@/actions/ledger'
import { getAccounts } from '@/actions/accounts'
import { LedgerTable } from '@/components/ledger/LedgerTable'
import { LedgerFilter } from '@/components/ledger/LedgerFilter'
import { FileSpreadsheet } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface LedgerPageProps {
  searchParams: {
    accountId?: string
    type?: 'IN' | 'OUT'
  }
}

export default async function LedgerPage({ searchParams }: LedgerPageProps) {
  // Fetch ledger entries and accounts in parallel
  const [{ data: entries, error: ledgerError }, { data: accounts }] = await Promise.all([
    getLedgerEntries({
      accountId: searchParams.accountId,
      type: searchParams.type,
    }),
    getAccounts()
  ])

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto min-h-screen bg-gray-50/50 space-y-6 animate-in fade-in duration-350">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-[10px] shadow-sm">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Buku Kas & Ledger Keuangan</h1>
            <p className="text-sm text-gray-500 mt-0.5">Catatan pergerakan arus kas masuk, kas keluar, dan mutasi internal.</p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <LedgerFilter accounts={accounts || []} />

      {/* Error or Ledger Table */}
      {ledgerError ? (
        <div className="bg-red-50 text-red-700 p-6 rounded-[10px] border border-red-100 flex items-start shadow-sm">
          <span className="text-xl mr-3">⚠️</span>
          <div>
            <h3 className="font-bold text-red-900">Gagal memuat catatan ledger</h3>
            <p className="text-sm mt-1 opacity-90">{ledgerError}</p>
          </div>
        </div>
      ) : (
        <LedgerTable entries={entries || []} />
      )}
    </div>
  )
}
