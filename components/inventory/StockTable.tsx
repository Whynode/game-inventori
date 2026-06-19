'use client'

import { useState, useRef, Fragment } from 'react'
import Image from 'next/image'
import { Stock } from '@/types/database'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { StockRowActions } from './StockRowActions'
import { formatRupiah } from '@/lib/utils'
import { Inbox, ChevronLeft, ChevronRight } from 'lucide-react'

interface StockTableProps {
  stocks: Stock[]
  categories: any[]
}

export function StockTable({ stocks, categories }: StockTableProps) {
  const [activeGame, setActiveGame] = useState('Semua')
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const displayCategories = [{ id: 'all', name: 'Semua', image_url: '' }, ...categories]

  const filteredStocks = activeGame === 'Semua' 
    ? stocks 
    : stocks.filter(s => s.category.toLowerCase() === activeGame.toLowerCase())

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' })
    }
  }

  return (
    <div className="flex flex-col h-full overflow-hidden space-y-4">
      {/* Visual Filter Bar */}
      <div className="flex-shrink-0 relative group">
        {/* Left Fade & Button */}
        <div className="absolute left-0 top-0 bottom-6 w-20 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none flex items-center justify-start">
          <button 
            onClick={scrollLeft}
            className="w-8 h-8 flex items-center justify-center bg-white shadow-md rounded-full text-slate-600 border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto ml-1 hover:bg-slate-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Right Fade & Button */}
        <div className="absolute right-0 top-0 bottom-6 w-20 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none flex items-center justify-end">
          <button 
            onClick={scrollRight}
            className="w-8 h-8 flex items-center justify-center bg-white shadow-md rounded-full text-slate-600 border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto mr-1 hover:bg-slate-50"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div 
          ref={scrollRef}
          className="flex items-start gap-4 overflow-x-auto py-4 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {displayCategories.map(category => {
            const isSelected = activeGame === category.name
            return (
              <div 
                key={category.id}
                onClick={() => setActiveGame(category.name)}
                className="flex flex-col items-center group/item cursor-pointer shrink-0 w-[88px]"
              >
                <div 
                  className={`w-20 h-20 bg-slate-50 border rounded-2xl overflow-hidden relative shadow-sm transition-all duration-300 ${
                    isSelected 
                      ? 'ring-2 ring-blue-600 ring-offset-2 opacity-100 border-transparent' 
                      : 'border-slate-200 opacity-50 group-hover/item:opacity-100 group-hover/item:border-blue-300'
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
                    <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-100">
                      <span className="text-xs font-medium">{category.name === 'Semua' ? 'All' : 'No Img'}</span>
                    </div>
                  )}
                </div>
                <p className={`text-xs font-medium text-center mt-2.5 tracking-tight transition-colors truncate w-full px-1 ${
                  isSelected ? 'text-blue-700' : 'text-slate-500 group-hover/item:text-blue-600'
                }`}>
                  {category.name}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex-1 min-h-0 w-full border border-slate-200 rounded-xl bg-white flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <table className="w-full table-fixed whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-40">Kode Stok</th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-32">Kategori</th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Detail (Login)</th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-48">Harga</th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-32">Status</th>
                <th className="py-3 px-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider w-28">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStocks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Inbox className="w-10 h-10 text-slate-300 mb-3 stroke-[1.5]" />
                      <span className="text-sm text-slate-500">Tidak ada stok akun ditemukan untuk "{activeGame}".</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredStocks.map((stock) => (
                  <Fragment key={stock.id}>
                    <tr 
                      onClick={() => setExpandedRowId(expandedRowId === stock.id ? null : stock.id)}
                      className={`hover:bg-slate-50/50 transition-colors group cursor-pointer ${expandedRowId === stock.id ? 'bg-slate-50' : ''}`}
                    >
                      <td className="py-3 px-4 text-[13px] font-semibold text-slate-900 truncate" title={stock.name}>
                        {stock.name}
                      </td>
                      <td className="py-3 px-4 text-[13px] truncate">
                        <span className="inline-flex px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[11px] font-medium truncate" title={stock.category}>
                          {stock.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[13px] truncate" title={`${stock.username || '-'} (${stock.account_details || '-'})`}>
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="font-medium text-slate-900 truncate">{stock.username || '-'}</span>
                          <span className="text-[11px] text-slate-400 truncate">({stock.account_details || '-'})</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[13px] text-slate-900 truncate" title={`${formatRupiah(stock.current_price)} (Modal: ${formatRupiah(stock.capital_price)})`}>
                        <span className="font-semibold truncate">{formatRupiah(stock.current_price)}</span>
                        <span className="text-[11px] text-slate-400 ml-1.5 truncate">Modal: {formatRupiah(stock.capital_price)}</span>
                      </td>
                      <td className="py-3 px-4 text-[13px] text-slate-500 truncate">
                        <StatusBadge status={stock.status} />
                      </td>
                      <td className="py-3 px-4 text-right text-[13px] font-medium truncate" onClick={(e) => e.stopPropagation()}>
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
    </div>
  )
}
