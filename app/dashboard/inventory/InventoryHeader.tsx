'use client'

import { useState } from 'react'
import { AddStockModal } from '@/components/inventory/AddStockModal'
import { Plus, Package } from 'lucide-react'

interface InventoryHeaderProps {
  categories: any[]
}

export function InventoryHeader({ categories }: InventoryHeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-[10px]">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Manajemen Inventori</h1>
            <p className="text-sm text-slate-500 mt-1">Kelola stok akun game, harga, dan ketersediaan.</p>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-5 py-2.5 rounded-[10px] font-semibold transition-all shadow-sm shadow-blue-200 hover:shadow-md hover:shadow-blue-200 w-full sm:w-auto text-sm"
        >
          <Plus className="w-5 h-5" />
          Tambah Stok Baru
        </button>
      </div>

      <AddStockModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        categories={categories}
      />
    </>
  )
}
