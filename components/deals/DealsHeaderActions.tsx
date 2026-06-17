'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { CreateDealModal } from './CreateDealModal'

export function DealsHeaderActions() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-[10px] font-semibold transition-all shadow-sm shadow-purple-200 active:scale-95"
      >
        <Plus className="w-5 h-5" />
        Buat Transaksi Baru
      </button>

      <CreateDealModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  )
}
