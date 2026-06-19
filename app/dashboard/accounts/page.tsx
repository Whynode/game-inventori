import { getAccounts } from '@/actions/accounts'
import { AccountsClient } from '@/components/accounts/AccountsClient'
import { Wallet } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AccountsPage() {
  const { data: accounts, error } = await getAccounts()

  return (
    <div className="max-w-[1600px] mx-auto min-h-[calc(100vh-5rem)] flex flex-col bg-gray-50/50 p-4 md:p-6 pb-8">
      {/* Title Header */}
      <div className="flex-shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-100 text-blue-600 rounded-lg shadow-sm">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Kelola Rekening & Kas</h1>
            <p className="text-xs text-gray-500 mt-0.5">Pantau saldo kas real-time dan kelola mutasi antar rekening.</p>
          </div>
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-100 flex items-start shadow-sm flex-shrink-0">
          <span className="text-xl mr-3">⚠️</span>
          <div>
            <h3 className="font-bold text-red-900">Gagal memuat daftar rekening</h3>
            <p className="text-sm mt-1 opacity-90">{error}</p>
          </div>
        </div>
      ) : (
        <AccountsClient accounts={accounts || []} />
      )}
    </div>
  )
}
