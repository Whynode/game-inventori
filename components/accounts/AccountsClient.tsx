'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Account } from '@/types/database'
import { Plus, ArrowRightLeft, Landmark } from 'lucide-react'
import { AddAccountModal } from './AddAccountModal'
import { TransferFundsModal } from './TransferFundsModal'
import { formatRupiah } from '@/lib/utils'

interface AccountsClientProps {
  accounts: Account[]
}

const LOGO_MAP: { keyword: string; file: string | null }[] = [
  { keyword: 'qris',    file: '/img/rekening/QRIS.webp' },
  { keyword: 'dana',    file: '/img/rekening/DANA.webp' },
  { keyword: 'ovo',     file: '/img/rekening/OVO.webp' },
  { keyword: 'gopay',   file: '/img/rekening/GOPAY.webp' },
  { keyword: 'mandiri', file: '/img/rekening/MANDIRI.webp' },
  { keyword: 'seabank', file: '/img/rekening/SEABANK.webp' },
  { keyword: 'jago',    file: null },
  { keyword: 'bca',     file: null },
]

function getAccountLogo(name: string): { file: string | null } {
  const lower = name.toLowerCase()
  for (const entry of LOGO_MAP) {
    if (lower.includes(entry.keyword)) {
      return { file: entry.file }
    }
  }
  return { file: null }
}

export function AccountsClient({ accounts }: AccountsClientProps) {
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isTransferOpen, setIsTransferOpen] = useState(false)

  const totalBalance = accounts.reduce((sum, acc) => sum + (acc.is_active ? Number(acc.balance) : 0), 0)

  return (
    <div className="flex flex-col flex-1 overflow-hidden min-h-0 space-y-6">
      {/* Hero Header Replicated from image_d4fa7b.png */}
      <div className="flex-shrink-0 bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 mb-1">TOTAL SALDO KAS</p>
          <h2 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">
            {formatRupiah(totalBalance)}
          </h2>
          <p className="text-sm font-medium text-blue-600">Akumulasi dari rekening aktif</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto mt-6 md:mt-0">
          <button
            onClick={() => setIsTransferOpen(true)}
            className="flex items-center justify-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm w-full sm:w-auto"
          >
            <ArrowRightLeft className="w-4 h-4" />
            Mutasi Saldo
          </button>
          
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center justify-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            Tambah Rekening
          </button>
        </div>
      </div>

      {/* Grid of Accounts Container */}
      <div className="flex-1 w-full pb-6">
        {accounts.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-500 shadow-sm">
            <span className="text-3xl mb-3 block">💳</span>
            <p className="font-medium text-gray-900 text-base">Belum ada rekening terdaftar</p>
            <p className="text-sm text-gray-400 mt-1">Silakan tambahkan rekening baru untuk mulai mencatat keuangan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {accounts.map((acc) => {
              const { file: logoFile } = getAccountLogo(acc.name)
              const isActive = acc.is_active

              return (
                <div 
                  key={acc.id}
                  className={`
                    bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col
                    ${!isActive ? 'opacity-50 grayscale' : ''}
                  `}
                >
                  {/* Top: Full-Width Banner Image - Compressed Height */}
                  <div className="relative w-full h-24 bg-slate-50 border-b border-slate-100 flex items-center justify-center overflow-hidden">
                    {logoFile ? (
                      <Image
                        src={logoFile}
                        alt={acc.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <Landmark className="w-10 h-10 text-slate-300" />
                    )}
                  </div>

                  {/* Bottom: Text Content - Minimalist */}
                  <div className="p-4 flex flex-col flex-1">
                    <div className="mb-3">
                      <h3 className="text-sm font-bold text-slate-900 mb-0.5">{acc.name}</h3>
                      <p className="text-xs text-slate-500 font-mono">{acc.account_number || 'Tidak ada no. rekening'}</p>
                    </div>

                    <div className="mt-auto pt-3 border-t border-slate-100 flex justify-between items-end">
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Saldo Terkini</p>
                      <p className="text-lg font-bold text-slate-900 tracking-tight leading-none">
                        {formatRupiah(acc.balance)}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddAccountModal 
        isOpen={isAddOpen} 
        onClose={() => setIsAddOpen(false)} 
      />

      <TransferFundsModal 
        isOpen={isTransferOpen} 
        onClose={() => setIsTransferOpen(false)} 
        accounts={accounts} 
      />
    </div>
  )
}
