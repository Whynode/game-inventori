'use client'

import { useState, Fragment } from 'react'
import Image from 'next/image'
import { Stock } from '@/types/database'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { StockRowActions } from './StockRowActions'
import { formatRupiah } from '@/lib/utils'
import { Inbox } from 'lucide-react'

interface StockTableProps {
  stocks: Stock[]
  categories: any[]
}

export function StockTable({ stocks, categories }: StockTableProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null)

  const filteredStocks = selectedCategory 
    ? stocks.filter(s => s.category.toLowerCase() === selectedCategory.toLowerCase())
    : stocks

  return (
    <div className="space-y-6">
      {/* Minimalist Dynamic Category Filter Grid */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        {categories.map(category => {
          const isSelected = selectedCategory === category.name
          return (
            <div 
              key={category.id}
              onClick={() => setSelectedCategory(isSelected ? null : category.name)}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div 
                className={`w-full aspect-square bg-slate-50 border rounded-[10px] overflow-hidden relative shadow-sm hover:shadow-md transition-shadow duration-300 ${
                  isSelected 
                    ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-50/50' 
                    : 'border-slate-100 group-hover:border-blue-200'
                }`}
              >
                {category.image_url ? (
                  <Image 
                    src={category.image_url} 
                    alt={category.name} 
                    fill 
                    className="object-cover" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <span className="text-xs">No Image</span>
                  </div>
                )}
              </div>
              <p className={`text-sm font-semibold text-center mt-2 tracking-tight transition-colors ${
                isSelected ? 'text-blue-700' : 'text-slate-700 group-hover:text-blue-600'
              }`}>
                {category.name}
              </p>
            </div>
          )
        })}
      </div>

      <div className="w-full overflow-x-auto border border-slate-200 rounded-xl bg-white">
        <table className="w-full table-fixed whitespace-nowrap">
          <thead className="bg-blue-600 border-b border-blue-700">
            <tr>
              <th className="py-2 px-3 text-left text-[11px] font-semibold text-white uppercase tracking-wide w-40">Kode Stok</th>
              <th className="py-2 px-3 text-left text-[11px] font-semibold text-white uppercase tracking-wide w-32">Kategori</th>
              <th className="py-2 px-3 text-left text-[11px] font-semibold text-white uppercase tracking-wide">Detail (Login)</th>
              <th className="py-2 px-3 text-left text-[11px] font-semibold text-white uppercase tracking-wide w-48">Harga</th>
              <th className="py-2 px-3 text-left text-[11px] font-semibold text-white uppercase tracking-wide w-28">Status</th>
              <th className="py-2 px-3 text-right text-[11px] font-semibold text-white uppercase tracking-wide w-28">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredStocks.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <Inbox className="w-10 h-10 text-slate-300 mb-3 stroke-[1.5]" />
                    <span className="text-sm text-slate-500">Tidak ada stok akun ditemukan. {selectedCategory && 'Coba hapus filter kategori.'}</span>
                  </div>
                </td>
              </tr>
            ) : (
              filteredStocks.map((stock) => (
                <Fragment key={stock.id}>
                  <tr 
                    onClick={() => setExpandedRowId(expandedRowId === stock.id ? null : stock.id)}
                    className={`hover:bg-slate-50/50 transition-colors group cursor-pointer ${expandedRowId === stock.id ? 'bg-slate-50/50' : ''}`}
                  >
                    <td className="py-2 px-3 text-[13px] font-semibold text-slate-900 truncate" title={stock.name}>
                    {stock.name}
                  </td>
                  <td className="py-2 px-3 text-[13px] truncate">
                    <span className="inline-flex px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[11px] font-medium truncate" title={stock.category}>
                      {stock.category}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-[13px] truncate" title={`${stock.username || '-'} (${stock.account_details || '-'})`}>
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="font-medium text-slate-900 truncate">{stock.username || '-'}</span>
                      <span className="text-[11px] text-slate-400 truncate">({stock.account_details || '-'})</span>
                    </div>
                  </td>
                  <td className="py-2 px-3 text-[13px] text-slate-900 truncate" title={`${formatRupiah(stock.current_price)} (Modal: ${formatRupiah(stock.capital_price)})`}>
                    <span className="font-semibold truncate">{formatRupiah(stock.current_price)}</span>
                    <span className="text-[11px] text-slate-400 ml-1.5 truncate">Modal: {formatRupiah(stock.capital_price)}</span>
                  </td>
                  <td className="py-2 px-3 text-[13px] text-slate-500 truncate">
                    <StatusBadge status={stock.status} />
                  </td>
                  <td className="py-2 px-3 text-right text-[13px] font-medium truncate" onClick={(e) => e.stopPropagation()}>
                    <StockRowActions stock={stock} categories={categories} />
                  </td>
                </tr>
                {expandedRowId === stock.id && (
                  <tr className="bg-slate-50/50 border-b border-slate-100/50">
                    <td colSpan={6} className="py-4 px-4 whitespace-normal">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[13px] bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                        <div>
                          <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Detail Akun</span>
                          <p className="font-medium text-slate-900 mb-0.5">{stock.name}</p>
                          <p className="text-slate-500">{stock.category}</p>
                        </div>
                        <div>
                          <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Kredensial Login</span>
                          <p className="text-slate-700"><span className="font-medium text-slate-900">User:</span> {stock.username || '-'}</p>
                          <p className="text-slate-700 mt-0.5"><span className="font-medium text-slate-900">Info:</span> {stock.account_details || '-'}</p>
                        </div>
                        <div>
                          <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Informasi Harga</span>
                          <p className="text-slate-700"><span className="font-medium text-slate-900">Harga Modal:</span> {formatRupiah(stock.capital_price)}</p>
                          <p className="text-slate-700 mt-0.5"><span className="font-medium text-slate-900">Harga Jual:</span> {formatRupiah(stock.current_price)}</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
                </Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
