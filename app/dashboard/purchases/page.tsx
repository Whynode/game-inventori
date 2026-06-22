'use client'

import React, { useState, useEffect } from 'react'
import { Search, Filter, Plus, ChevronDown, MoreHorizontal, X, Loader2, Download } from 'lucide-react'
import { formatRupiah, formatDate } from '@/lib/utils'
import { getPurchases, purchaseStock, getGames } from '@/actions/purchases'
import { getAccounts } from '@/app/actions/accounts'

type Purchase = any
type Game = { id: string; name: string }
type Account = { id: string; name: string; is_active: boolean; balance: number }

export default function PurchasesPage() {
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [games, setGames] = useState<Game[]>([])
  const [accounts, setAccounts] = useState<Account[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL') // ALL, LUNAS, PENDING
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false)

  // Form State
  const [selectedStatus, setSelectedStatus] = useState<'LUNAS' | 'PENDING'>('LUNAS')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [purchasesRes, gamesRes, accountsData] = await Promise.all([
        getPurchases(),
        getGames(),
        getAccounts()
      ])
      setPurchases(purchasesRes.data || [])
      setGames(gamesRes.data || [])
      setAccounts((accountsData as any) || [])
    } catch (err) {
      console.error('Error loading purchases data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddPurchase = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    
    const category = formData.get('category') as string
    const name = formData.get('name') as string
    const account_details = formData.get('account_details') as string
    const username = formData.get('username') as string
    const password = formData.get('password') as string
    const capital_price = parseFloat(formData.get('capital_price') as string) || 0
    const post_price = parseFloat(formData.get('post_price') as string) || 0
    const current_price = parseFloat(formData.get('current_price') as string) || post_price
    const seller_info = formData.get('seller_info') as string
    const internal_notes = formData.get('internal_notes') as string
    const purchase_payment_status = formData.get('purchase_payment_status') as 'LUNAS' | 'PENDING'
    const payment_account_id = formData.get('payment_account_id') as string || null

    if (!category || !name || !capital_price || !post_price) {
      setError('Kategori game, nama item, harga modal, dan harga post wajib diisi.')
      setIsSubmitting(false)
      return
    }

    if (purchase_payment_status === 'LUNAS' && !payment_account_id) {
      setError('Target Rekening/Sumber Pembayaran wajib dipilih untuk status LUNAS.')
      setIsSubmitting(false)
      return
    }

    try {
      const res = await purchaseStock({
        category,
        name,
        account_details,
        username,
        password,
        capital_price,
        post_price,
        current_price,
        seller_info,
        internal_notes,
        purchase_payment_status,
        payment_account_id
      })

      if (res.error) {
        setError(res.error)
      } else {
        setIsAddOpen(false)
        loadData()
      }
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan data pembelian.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Filter & Search Logic
  const filteredPurchases = purchases.filter(purchase => {
    const matchesSearch = 
      purchase.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      purchase.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      purchase.seller_info?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = 
      statusFilter === 'ALL' || 
      purchase.purchase_payment_status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Pembelian Stok</h1>
          <p className="text-sm text-slate-500 mt-0.5">Catat setiap pembelian akun dari penjual, harga modal, dan kewajiban pembayaran.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm">
            <Download className="h-4 w-4" />
            Export Data
          </button>
          <button 
            onClick={() => {
              setError('')
              setIsAddOpen(true)
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Catat Pembelian Baru
          </button>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white border border-slate-100 shadow-sm rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-900 placeholder-slate-400 bg-slate-50 outline-none transition-all"
            placeholder="Cari ID pembelian, item, atau supplier..."
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto relative">
          <button 
            onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
            className="inline-flex items-center justify-between gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 w-full sm:w-auto min-w-[160px]"
          >
            <span className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <span>
                {statusFilter === 'ALL' && 'Semua Status'}
                {statusFilter === 'LUNAS' && 'Lunas'}
                {statusFilter === 'PENDING' && 'Pending'}
              </span>
            </span>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>

          {isFilterDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-lg z-10 py-1">
              <button 
                onClick={() => { setStatusFilter('ALL'); setIsFilterDropdownOpen(false) }}
                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium"
              >
                Semua Status
              </button>
              <button 
                onClick={() => { setStatusFilter('LUNAS'); setIsFilterDropdownOpen(false) }}
                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium"
              >
                Lunas
              </button>
              <button 
                onClick={() => { setStatusFilter('PENDING'); setIsFilterDropdownOpen(false) }}
                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium"
              >
                Pending
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-100 shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50/80">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Tgl & ID Pembelian
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Item / Akun
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Supplier
                </th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Harga Modal
                </th>
                <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Metode Pembayaran
                </th>
                <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status Pembayaran
                </th>
                <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
                  </td>
                </tr>
              ) : filteredPurchases.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-sm text-slate-500">
                    Belum ada data pembelian stok.
                  </td>
                </tr>
              ) : (
                filteredPurchases.map((purchase) => {
                  const isLunas = purchase.purchase_payment_status === 'LUNAS'
                  const statusBadgeClass = isLunas 
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                    : 'bg-orange-50 text-orange-600 border-orange-100'

                  return (
                    <tr key={purchase.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900">{purchase.sku || 'N/A'}</span>
                          <span className="text-[10px] mt-0.5">{formatDate(purchase.purchase_date || purchase.created_at)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        <div className="flex flex-col">
                          <span className="block truncate max-w-[240px] font-semibold text-slate-800">{purchase.name}</span>
                          <span className="text-[10px] text-slate-400 mt-0.5">{purchase.category}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-600">
                        {purchase.seller_info || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-bold text-right">
                        {formatRupiah(purchase.capital_price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 text-center font-medium">
                        {purchase.accounts?.name || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusBadgeClass}`}>
                          {isLunas ? 'Lunas' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <button className="text-slate-400 hover:text-blue-600 transition-colors p-1 rounded-md hover:bg-blue-50">
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Info */}
        <div className="bg-white px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <div className="text-sm text-slate-500">
            Menampilkan <span className="font-semibold text-slate-900">{filteredPurchases.length > 0 ? 1 : 0}</span> - <span className="font-semibold text-slate-900">{filteredPurchases.length}</span> dari <span className="font-semibold text-slate-900">{filteredPurchases.length}</span> pembelian
          </div>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-slate-200 text-slate-400 rounded-md text-sm cursor-not-allowed">Sebelummnya</button>
            <button className="px-3 py-1 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-md text-sm font-medium">Selanjutnya</button>
          </div>
        </div>
      </div>

      {/* Buat Pembelian Baru Modal (Slide-over Drawer) */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-sm">
          <div className="bg-white h-full w-full max-w-md shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Catat Pembelian Baru</h2>
                <p className="text-xs text-slate-500 mt-1">Isi form transaksi pembelian akun dari penjual.</p>
              </div>
              <button 
                onClick={() => setIsAddOpen(false)} 
                className="text-slate-400 hover:text-slate-600 transition-colors bg-white p-2 rounded-full shadow-sm"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddPurchase} className="flex-1 flex flex-col overflow-hidden">
              <div className="p-6 flex-1 overflow-y-auto space-y-5">
                {error && (
                  <div className="p-3 bg-rose-50 text-rose-600 text-sm rounded-lg border border-rose-100">
                    {error}
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Kategori Game</label>
                  <select name="category" required className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                    <option value="">-- Pilih Game --</option>
                    {games.map(game => (
                      <option key={game.id} value={game.name}>{game.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nama Item / Akun</label>
                  <input 
                    name="name" 
                    required 
                    type="text" 
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
                    placeholder="Mis. MLBB Mythic Glory 120 Skins" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Login Username/Email</label>
                    <input 
                      name="username" 
                      type="text" 
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
                      placeholder="Username/email" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Login Password</label>
                    <input 
                      name="password" 
                      type="text" 
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
                      placeholder="Password" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Spek / Detail Akun</label>
                  <textarea 
                    name="account_details" 
                    rows={2} 
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
                    placeholder="Masukkan spesifikasi akun (heros, skins, winrate, dll)..." 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Harga Modal</label>
                    <input 
                      name="capital_price" 
                      required 
                      type="number" 
                      min="1"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold" 
                      placeholder="Rp 0" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Harga Post Jual</label>
                    <input 
                      name="post_price" 
                      required 
                      type="number" 
                      min="1"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold" 
                      placeholder="Rp 0" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Supplier / Penjual</label>
                    <input 
                      name="seller_info" 
                      type="text" 
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
                      placeholder="Nama seller/supplier" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Status Pembayaran</label>
                    <select 
                      name="purchase_payment_status" 
                      required
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value as 'LUNAS' | 'PENDING')}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="LUNAS">Lunas</option>
                      <option value="PENDING">Pending</option>
                    </select>
                  </div>
                </div>

                {selectedStatus === 'LUNAS' && (
                  <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 animate-in fade-in duration-200">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Sumber Rekening / Metode Pembayaran</label>
                    <select name="payment_account_id" required className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white">
                      <option value="">-- Pilih Rekening Pembayaran --</option>
                      {accounts.filter(a => a.is_active).map(acc => (
                        <option key={acc.id} value={acc.id}>{acc.name} ({formatRupiah(acc.balance)})</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Catatan Internal (Opsional)</label>
                  <textarea 
                    name="internal_notes" 
                    rows={2} 
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
                    placeholder="Catatan tambahan untuk internal..." 
                  />
                </div>

              </div>
              
              <div className="p-6 border-t border-slate-100 bg-white">
                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="w-full px-4 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>Catat Pembelian</span>
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
