'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Account } from '@/types/database'
import { Plus, ArrowRightLeft, Landmark } from 'lucide-react'
import { AddAccountModal } from './AddAccountModal'
import { TransferFundsModal } from './TransferFundsModal'
import { formatRupiah, formatDate } from '@/lib/utils'

interface AccountsClientProps {
  accounts: Account[]
}

const LOGO_MAP: { keyword: string; file: string | null; gradient: string; bottomGradient: string }[] = [
  { keyword: 'qris',    file: '/img/rekening/QRIS.webp',    gradient: 'from-rose-500 via-orange-500 to-amber-400', bottomGradient: 'from-slate-50/30 via-white/80 to-white' },
  { keyword: 'dana',    file: '/img/rekening/DANA.webp',     gradient: 'from-sky-400 to-blue-600', bottomGradient: 'from-blue-50/30 via-white/80 to-white' },
  { keyword: 'ovo',     file: '/img/rekening/OVO.webp',      gradient: 'from-purple-500 to-indigo-600', bottomGradient: 'from-purple-50/30 via-white/80 to-white' },
  { keyword: 'gopay',   file: '/img/rekening/GOPAY.webp',    gradient: 'from-emerald-400 to-teal-600', bottomGradient: 'from-sky-50/30 via-white/80 to-white' },
  { keyword: 'mandiri', file: '/img/rekening/MANDIRI.webp',  gradient: 'from-blue-600 to-blue-900', bottomGradient: 'from-blue-50/30 via-white/80 to-white' },
  { keyword: 'seabank', file: '/img/rekening/SEABANK.webp',  gradient: 'from-cyan-400 to-blue-500', bottomGradient: 'from-orange-50/30 via-white/80 to-white' },
  { keyword: 'jago',    file: null,                          gradient: 'from-yellow-400 to-amber-500', bottomGradient: 'from-slate-50/30 via-white/80 to-white' },
  { keyword: 'bca',     file: null,                          gradient: 'from-blue-500 to-blue-700', bottomGradient: 'from-slate-50/30 via-white/80 to-white' },
]

function getAccountLogo(name: string): { file: string | null; gradient: string; bottomGradient: string } {
  const lower = name.toLowerCase()
  for (const entry of LOGO_MAP) {
    if (lower.includes(entry.keyword)) {
      return { file: entry.file, gradient: entry.gradient, bottomGradient: entry.bottomGradient }
    }
  }
  return { file: null, gradient: 'from-slate-500 to-slate-700', bottomGradient: 'from-slate-50/30 via-white/80 to-white' }
}

export function AccountsClient({ accounts }: AccountsClientProps) {
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isTransferOpen, setIsTransferOpen] = useState(false)

  const totalBalance = accounts.reduce((sum, acc) => sum + (acc.is_active ? Number(acc.balance) : 0), 0)

  return (
    <div className="space-y-8">
      {/* Top Header Summary Card & Actions */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between shadow-sm mb-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Total Saldo Kas</p>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            {formatRupiah(totalBalance)}
          </h2>
          <p className="text-sm text-slate-500 mt-1">Akumulasi saldo dari seluruh rekening aktif</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto mt-6 md:mt-0">
          <button
            onClick={() => setIsTransferOpen(true)}
            className="flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm w-full sm:w-auto"
          >
            <ArrowRightLeft className="w-4 h-4" />
            Mutasi Saldo
          </button>
          
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            Tambah Rekening
          </button>
        </div>
      </div>

      {/* Grid of Accounts */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-5">Daftar Rekening & E-Wallet</h3>
        
        {accounts.length === 0 ? (
          <div className="bg-white rounded-[10px] border border-gray-200 p-12 text-center text-gray-500 shadow-sm">
            <span className="text-3xl mb-3 block">💳</span>
            <p className="font-medium text-gray-900 text-base">Belum ada rekening terdaftar</p>
            <p className="text-sm text-gray-400 mt-1">Silakan tambahkan rekening baru untuk mulai mencatat keuangan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {accounts.map((acc) => {
              const { file: logoFile, gradient, bottomGradient } = getAccountLogo(acc.name)
              const isActive = acc.is_active

              return (
                <div 
                  key={acc.id}
                  className={`
                    bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-blue-200 hover:shadow-md transition-all duration-300 flex flex-col group
                    ${!isActive && 'opacity-50 grayscale'}
                  `}
                >
                  {/* Top Half: Cover Image */}
                  <div className="relative w-full h-28 overflow-hidden border-b border-slate-100 bg-slate-50">
                    {logoFile ? (
                      <Image
                        src={logoFile}
                        alt={acc.name}
                        fill
                        className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                        unoptimized
                      />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${gradient} transition-transform duration-300 group-hover:scale-105`}>
                        <Landmark className="w-8 h-8 text-white/50" />
                      </div>
                    )}
                  </div>

                  {/* Bottom Half: Text & Description */}
                  <div className="px-5 py-3.5 flex flex-col flex-1 bg-white">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 truncate">{acc.name}</h3>
                      <p className="text-xs text-slate-500 font-medium truncate leading-tight">{acc.account_number || 'No rekening belum diisi'}</p>
                    </div>

                    {/* Card Divider */}
                    <div className="w-full h-px bg-slate-100 my-2.5"></div>

                    {/* Card Footer (Balance) */}
                    <div className="mt-auto">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 leading-tight mb-0.5">Saldo Terkini</p>
                      <p className="text-base font-bold text-slate-900 tracking-tight leading-none">
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
