'use client'

import { useState } from 'react'
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

      <div className="w-full overflow-hidden rounded-[10px] border border-slate-200 bg-white shadow-sm">
        <table className="w-full divide-y divide-slate-200 table-fixed">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 uppercase tracking-wider w-[18%]">Kode Stok</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 uppercase tracking-wider w-[15%]">Kategori</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 uppercase tracking-wider w-[25%]">Detail (Login)</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 uppercase tracking-wider w-[16%]">Harga</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 uppercase tracking-wider w-[10%]">Status</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 uppercase tracking-wider w-[16%]">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
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
                <tr key={stock.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-4 py-3 text-sm font-semibold text-slate-900 truncate">
                    {stock.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500 truncate">
                    {stock.category}
                  </td>
                  <td className="px-4 py-3 text-sm truncate">
                    <div className="flex flex-col truncate">
                      <span className="font-medium text-slate-900 truncate">{stock.username || '-'}</span>
                      <span className="text-xs text-slate-400 mt-0.5 truncate">{stock.account_details || '-'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-900 truncate">
                    <span className="font-bold">{formatRupiah(stock.current_price)}</span>
                    <span className="text-xs text-slate-400 block mt-0.5 truncate">Modal: {formatRupiah(stock.capital_price)}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500">
                    <StatusBadge status={stock.status} />
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-medium">
                    <StockRowActions stock={stock} categories={categories} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
