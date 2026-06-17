'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Account } from '@/types/database'

interface LedgerFilterProps {
  accounts: Account[]
}

import { ChevronDown, Download, FileText, Calendar, Search } from 'lucide-react'

export function LedgerFilter({ accounts }: LedgerFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentAccountId = searchParams.get('accountId') || ''
  const currentType = searchParams.get('type') || ''

  function handleFilterChange(key: 'accountId' | 'type', value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/dashboard/ledger?${params.toString()}`)
  }

  const selectClass = "w-full xl:w-[180px] shrink-0 border border-slate-200 rounded-md bg-white px-3 py-2 text-sm text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none cursor-pointer"
  const buttonClass = "flex items-center gap-2 border border-slate-200 rounded-md px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"

  return (
    <div className="bg-white border border-slate-100 rounded-md shadow-sm p-5 mb-6 w-full">
      <div className="flex flex-col xl:flex-row items-center justify-between gap-4 w-full">
        {/* Left Side (Dropdowns) */}
        <div className="flex items-center gap-3 w-full xl:w-auto">
          <div className="relative w-full xl:w-auto">
            <select
              value={currentAccountId}
              onChange={(e) => handleFilterChange('accountId', e.target.value)}
              className={`${selectClass} h-10`}
            >
              <option value="">Semua Rekening</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          <div className="relative w-full xl:w-auto">
            <select
              value={currentType}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className={`${selectClass} h-10`}
            >
              <option value="">Semua Status</option>
              <option value="IN">Uang Masuk (IN)</option>
              <option value="OUT">Uang Keluar (OUT)</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          {(currentAccountId || currentType) && (
            <button
              onClick={() => router.push('/dashboard/ledger')}
              className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors px-2 flex items-center h-10"
            >
              Reset Filter
            </button>
          )}
        </div>

        {/* Right Side (Range & Export Buttons) */}
        <div className="flex items-center gap-3 w-full xl:w-auto justify-start xl:justify-end">
          <div className="relative w-full xl:w-[220px]">
            <input 
              type="text" 
              placeholder="Cari transaksi..." 
              className="border border-slate-200 rounded-md bg-white pl-9 pr-3 text-sm text-slate-700 outline-none w-full focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 h-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
          
          <button className={`${buttonClass} h-10 shrink-0 whitespace-nowrap`}>
            <Calendar className="w-4 h-4 text-slate-500" />
            Range filter
          </button>
          
          <button className={`${buttonClass} h-10 shrink-0 whitespace-nowrap`}>
            <Download className="w-4 h-4 text-emerald-600" />
            Excel
          </button>
        </div>
      </div>
    </div>
  )
}
