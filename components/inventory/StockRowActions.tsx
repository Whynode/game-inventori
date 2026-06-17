'use client'

import { useState, useTransition } from 'react'
import { MoreVertical, Edit2, Trash2, Loader2, AlertTriangle, Eye } from 'lucide-react'
import { Stock } from '@/types/database'
import { deleteStock } from '@/actions/stocks'
import { EditStockModal } from './EditStockModal'
import { ViewStockModal } from './ViewStockModal'

interface StockRowActionsProps {
  stock: Stock
  categories?: any[]
}

export function StockRowActions({ stock, categories = [] }: StockRowActionsProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  
  const [isPending, startTransition] = useTransition()
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const handleDelete = () => {
    setDeleteError(null)
    startTransition(async () => {
      const { success, error } = await deleteStock(stock.id)
      if (!success) {
        setDeleteError(error || 'Gagal menghapus stok.')
      } else {
        setIsDeleteDialogOpen(false)
        setIsMenuOpen(false)
      }
    })
  }

  return (
    <div className="relative flex justify-end">
      <button 
        onClick={toggleMenu}
        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-[10px] transition-colors"
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      {isMenuOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsMenuOpen(false)} 
          />
          <div className="absolute right-0 mt-10 w-48 bg-white rounded-[10px] shadow-lg border border-gray-100 py-1 z-20 animate-in fade-in zoom-in-95">
            <button
              onClick={() => {
                setIsMenuOpen(false)
                setIsViewModalOpen(true)
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <Eye className="w-4 h-4 text-emerald-500" />
              Lihat Detail
            </button>
            <div className="h-px bg-gray-100 my-1" />
            <button
              onClick={() => {
                setIsMenuOpen(false)
                setIsEditModalOpen(true)
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4 text-blue-500" />
              Edit Data
            </button>
            <div className="h-px bg-gray-100 my-1" />
            <button
              onClick={() => {
                setIsMenuOpen(false)
                setIsDeleteDialogOpen(true)
              }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Hapus Stok
            </button>
          </div>
        </>
      )}

      {/* View Modal */}
      <ViewStockModal 
        stock={stock} 
        isOpen={isViewModalOpen} 
        onClose={() => setIsViewModalOpen(false)} 
      />

      {/* Edit Modal */}
      <EditStockModal 
        stock={stock} 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)}
        categories={categories}
      />

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={!isPending ? () => setIsDeleteDialogOpen(false) : undefined} />
          <div className="relative w-full max-w-md bg-white rounded-[10px] shadow-2xl p-6 overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 mb-4 text-red-600">
              <div className="p-2 bg-red-100 rounded-[10px]">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold">Hapus Stok?</h2>
            </div>
            
            <p className="text-gray-600 text-sm mb-6">
              Anda yakin ingin menghapus stok <strong>{stock.name}</strong>? Tindakan ini tidak dapat dibatalkan.
            </p>

            {deleteError && (
              <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-700 text-xs rounded-[10px] font-medium">
                ⚠️ {deleteError}
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => {
                  setIsDeleteDialogOpen(false)
                  setDeleteError(null)
                }}
                disabled={isPending}
                className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-[10px] transition-all"
              >
                Batal
              </button>
              <button 
                onClick={handleDelete}
                disabled={isPending}
                className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-[10px] transition-all shadow-sm shadow-red-200 disabled:opacity-70 flex items-center gap-2"
              >
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                {isPending ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
