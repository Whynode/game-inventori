'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Stock } from '@/types/database'
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react'
import { formatRupiah, formatDate } from '@/lib/utils'
import { StatusBadge } from '@/components/ui/StatusBadge'

interface ViewStockModalProps {
  stock: Stock
  isOpen: boolean
  onClose: () => void
}

export function ViewStockModal({ stock, isOpen, onClose }: ViewStockModalProps) {
  const [startIndex, setStartIndex] = useState(0)

  if (!isOpen) return null

  const images = stock.images || []
  const hasImages = images.length > 0
  const totalImages = images.length
  const visibleCount = 3

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setStartIndex((prev) => Math.min(totalImages - visibleCount, prev + 1))
  }

  const visibleImages = images.slice(startIndex, startIndex + visibleCount)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-3xl bg-white rounded-[10px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{stock.name}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{stock.category}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-[10px] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto space-y-8 bg-gray-50/30">
          
          {/* Gallery Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-blue-500" />
                Image Gallery
              </h3>
              {totalImages > visibleCount && (
                <div className="flex gap-2">
                  <button 
                    onClick={handlePrev}
                    disabled={startIndex === 0}
                    className="p-1.5 bg-white border border-gray-200 rounded-[10px] text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={handleNext}
                    disabled={startIndex >= totalImages - visibleCount}
                    className="p-1.5 bg-white border border-gray-200 rounded-[10px] text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {hasImages ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 transition-all duration-300">
                {visibleImages.map((url, idx) => (
                  <div key={url + idx} className="relative aspect-video bg-gray-100 rounded-[10px] overflow-hidden border border-gray-200/60 shadow-sm group">
                    <Image
                      src={url}
                      alt={`Stock image ${startIndex + idx + 1}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full py-12 bg-gray-50 border border-dashed border-gray-200 rounded-[10px] flex flex-col items-center justify-center text-gray-400">
                <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm">No images available for this stock.</p>
              </div>
            )}
            
            {hasImages && (
              <p className="text-xs text-gray-400 text-center mt-2 font-medium">
                Showing {startIndex + 1}-{Math.min(startIndex + visibleCount, totalImages)} of {totalImages} images
              </p>
            )}
          </div>

          {/* Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-[10px] border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Account Credentials</h3>
              
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] font-semibold text-gray-500 uppercase">Username / Email</p>
                  <p className="text-sm font-medium text-gray-900">{stock.username || '-'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-gray-500 uppercase">Password</p>
                  <p className="text-sm font-mono text-gray-900">{stock.password || '-'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-gray-500 uppercase">Details / Note</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{stock.account_details || '-'}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-[10px] border border-gray-100 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Pricing & Status</h3>
                
                <div className="flex items-center justify-between py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-500">Capital Price</span>
                  <span className="text-sm font-mono font-medium text-gray-900">{formatRupiah(stock.capital_price)}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-500">Post Price</span>
                  <span className="text-sm font-mono font-medium text-gray-900">{formatRupiah(stock.post_price)}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-500 font-semibold">Current Price</span>
                  <span className="text-lg font-mono font-black text-blue-600">{formatRupiah(stock.current_price)}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-400">Added {formatDate(stock.created_at)}</span>
                <StatusBadge status={stock.status} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
