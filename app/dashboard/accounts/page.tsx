'use client'

import React, { useState, useEffect } from 'react'
import { Plus, ArrowRightLeft, Wallet, Building2, Smartphone, QrCode, MoreHorizontal, X, Loader2 } from 'lucide-react'
import { formatRupiah } from '@/lib/utils'
import { getAccounts, addAccount, transferBalance } from '@/app/actions/accounts'
import type { Database } from '@/types/database.types'

type Account = Database['public']['Tables']['accounts']['Row']

export default function AccountsPage() {
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false)
  const [isMutasiOpen, setIsMutasiOpen] = useState(false)
  const [accounts, setAccounts] = useState<Account[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadAccounts()
  }, [])

  const loadAccounts = async () => {
    try {
      setIsLoading(true)
      const data = await getAccounts()
      setAccounts(data)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddAccount = async (formData: FormData) => {
    try {
      setIsSubmitting(true)
      setError('')
      await addAccount(formData)
      setIsAddAccountOpen(false)
      loadAccounts()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleMutasi = async (formData: FormData) => {
    try {
      setIsSubmitting(true)
      setError('')
      await transferBalance(formData)
      setIsMutasiOpen(false)
      loadAccounts()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalBalance = accounts.reduce((sum, acc) => sum + Number(acc.balance), 0)

  const getIcon = (type: string) => {
    if (type.includes('QRIS') || type.includes('QR')) return QrCode
    if (type.includes('Bank')) return Building2
    return Smartphone
  }

  const getColor = (type: string) => {
    if (type.includes('QRIS')) return 'text-indigo-600 bg-indigo-50 border-indigo-100'
    if (type.includes('Digital')) return 'text-orange-600 bg-orange-50 border-orange-100'
    if (type.includes('Bank')) return 'text-amber-600 bg-amber-50 border-amber-100'
    return 'text-blue-500 bg-blue-50 border-blue-100'
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Kelola Rekening</h1>
          <p className="text-sm text-slate-500 mt-0.5">Pantau saldo, kelola metode pembayaran, dan mutasi antar dompet.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMutasiOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
          >
            <ArrowRightLeft className="h-4 w-4" />
            Mutasi Saldo
          </button>
          <button 
            onClick={() => setIsAddAccountOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Tambah Rekening
          </button>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-white border border-slate-100 shadow-sm rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden group">
        <svg className="absolute right-0 bottom-0 w-64 h-full opacity-[0.02] pointer-events-none group-hover:opacity-5 transition-opacity" viewBox="0 0 100 50" preserveAspectRatio="none">
          <path d="M0,50 L0,30 Q25,50 50,20 T100,10 L100,50 Z" fill="#2563eb"/>
        </svg>
        <div className="relative z-10 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <Wallet className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Saldo Kas</h2>
            <p className="text-3xl font-bold text-slate-900 tracking-tight mt-1">{formatRupiah(totalBalance)}</p>
          </div>
        </div>
        <div className="relative z-10 bg-slate-50 border border-slate-100 rounded-lg px-4 py-2 flex flex-col items-end">
          <span className="text-xs text-slate-500 font-medium">Jumlah Rekening Aktif</span>
          <span className="text-lg font-bold text-slate-800">{accounts.filter(a => a.is_active).length}</span>
        </div>
      </div>

      {/* Grid of Accounts */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((account) => {
            const IconComponent = getIcon(account.type)
            const colorClass = getColor(account.type)
            return (
              <div key={account.id} className="bg-white border border-slate-100 shadow-sm rounded-xl p-5 hover:shadow-md transition-shadow relative group">
                <div className="absolute top-4 right-4">
                  <button className="p-1.5 text-slate-400 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors">
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="flex items-center gap-3 mb-4">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center border ${colorClass}`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-tight">{account.name}</h3>
                    <p className="text-xs text-slate-500 font-medium">{account.type}</p>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 mb-4">
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-0.5">Nomor Rekening / ID</p>
                  <p className="text-sm font-semibold text-slate-700 tracking-wide font-mono">{account.account_number || '-'}</p>
                </div>

                <div className="flex items-end justify-between border-t border-slate-100 pt-4">
                  <div>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-0.5">Saldo Terkini</p>
                    <p className="text-xl font-bold text-slate-900 tracking-tight">{formatRupiah(Number(account.balance))}</p>
                  </div>
                  <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors">
                    Riwayat
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add Account Modal (Slide-over Drawer) */}
      {isAddAccountOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-sm">
          <div className="bg-white h-full w-full max-w-md shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Tambah Rekening Baru</h2>
                <p className="text-xs text-slate-500 mt-1">Isi form untuk menambah rekening atau metode pembayaran baru.</p>
              </div>
              <button 
                onClick={() => setIsAddAccountOpen(false)} 
                className="text-slate-400 hover:text-slate-600 transition-colors bg-white p-2 rounded-full shadow-sm"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form action={handleAddAccount} className="flex-1 flex flex-col overflow-hidden">
              <div className="p-6 flex-1 overflow-y-auto space-y-5">
                {error && <div className="p-3 bg-rose-50 text-rose-600 text-sm rounded-lg border border-rose-100">{error}</div>}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nama Rekening</label>
                  <input name="name" required type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Mis. BCA Fery" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tipe Rekening</label>
                  <select name="type" required className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                    <option value="Bank Konvensional">Bank Konvensional</option>
                    <option value="Bank Digital">Bank Digital</option>
                    <option value="E-Wallet">E-Wallet</option>
                    <option value="E-Wallet/QRIS">E-Wallet/QRIS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nomor Rekening / ID</label>
                  <input name="account_number" type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Mis. 1234567890" />
                </div>
              </div>
              <div className="p-6 border-t border-slate-100 bg-white">
                <button type="submit" disabled={isSubmitting} className="w-full px-4 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>Simpan Rekening</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mutasi Modal (Slide-over Drawer) */}
      {isMutasiOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-sm">
          <div className="bg-white h-full w-full max-w-md shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Mutasi Saldo</h2>
                <p className="text-xs text-slate-500 mt-1">Pindahkan saldo antar rekening atau dompet digital.</p>
              </div>
              <button 
                onClick={() => setIsMutasiOpen(false)} 
                className="text-slate-400 hover:text-slate-600 transition-colors bg-white p-2 rounded-full shadow-sm"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form action={handleMutasi} className="flex-1 flex flex-col overflow-hidden">
              <div className="p-6 flex-1 overflow-y-auto space-y-5">
                {error && <div className="p-3 bg-rose-50 text-rose-600 text-sm rounded-lg border border-rose-100">{error}</div>}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Dari Rekening</label>
                  <select name="from_account_id" required className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                    {accounts.map(acc => (
                      <option key={acc.id} value={acc.id}>{acc.name} - {formatRupiah(Number(acc.balance))}</option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-center -my-2 relative z-10">
                  <div className="bg-slate-100 rounded-full p-1 border border-white">
                    <ArrowRightLeft className="h-4 w-4 text-slate-500 rotate-90" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Ke Rekening</label>
                  <select name="to_account_id" required className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                    {accounts.map(acc => (
                      <option key={acc.id} value={acc.id}>{acc.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nominal Mutasi</label>
                  <input name="amount" type="number" required min="1" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Rp 0" />
                </div>
              </div>
              <div className="p-6 border-t border-slate-100 bg-white">
                <button type="submit" disabled={isSubmitting} className="w-full px-4 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <span>Proses Mutasi</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

