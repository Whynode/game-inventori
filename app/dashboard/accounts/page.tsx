import { getAccounts } from '@/actions/accounts'
import { AccountsClient } from '@/components/accounts/AccountsClient'
import { Wallet } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AccountsPage() {
  const { data: accounts, error } = await getAccounts()

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto min-h-screen bg-gray-50/50 space-y-8 animate-in fade-in duration-350">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-[10px] shadow-sm">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Kelola Rekening & Kas</h1>
            <p className="text-sm text-gray-500 mt-0.5">Pantau saldo kas real-time dan kelola mutasi antar rekening.</p>
          </div>
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 text-red-700 p-6 rounded-[10px] border border-red-100 flex items-start shadow-sm">
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
