import React from 'react'
import { FileText, Copy, Edit, LayoutTemplate } from 'lucide-react'

// Mock Data
const mockTemplates = [
  {
    id: 'TPL-001',
    name: 'Template Invoice Penjualan',
    type: 'Invoice/Struk',
    preview: 'Feryshop - Invoice #{ID}\nTanggal: {DATE}\nCustomer: {CUST_NAME}\n-----------------------\nItem: {ITEM_NAME}\nHarga: {PRICE}\nStatus: {STATUS}',
    lastUpdated: '10 Jun 2026'
  },
  {
    id: 'TPL-002',
    name: 'Format Postingan FB (Ready Stock)',
    type: 'Social Media',
    preview: '🔥 READY STOCK 🔥\nGame: {CATEGORY}\nAkun: {NAME}\n\nSpek Singkat:\n- \n- \n\n💰 Harga: {PRICE}\nRekber ON. Minat PM/WA!',
    lastUpdated: '12 Jun 2026'
  },
  {
    id: 'TPL-003',
    name: 'Pesan Broadcast WA - Tagihan DP',
    type: 'WhatsApp',
    preview: 'Halo kak {CUST_NAME}, mengingatkan tagihan untuk akun {ITEM_NAME} sebesar {REMAINING_AMOUNT}. Jatuh tempo hari ini ya kak 🙏',
    lastUpdated: '15 Jun 2026'
  }
]

export default function TemplatesPage() {
  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Manajemen Template</h1>
          <p className="text-sm text-slate-500 mt-0.5">Kelola format teks untuk postingan, invoice, dan auto-reply chat.</p>
        </div>
      </div>

      {/* Grid of Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockTemplates.map((tpl) => (
          <div key={tpl.id} className="bg-white border border-slate-100 shadow-sm rounded-xl overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-slate-50 bg-slate-50/50 flex items-start justify-between">
               <div>
                  <h2 className="text-sm font-bold text-slate-800">{tpl.name}</h2>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-bold border border-blue-100">{tpl.type}</span>
               </div>
               <LayoutTemplate className="h-5 w-5 text-slate-300" />
            </div>
            
            <div className="p-5 flex-1 bg-slate-50/30">
               <pre className="text-xs font-mono text-slate-600 whitespace-pre-wrap leading-relaxed">
                  {tpl.preview}
               </pre>
            </div>

            <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between bg-white">
               <span className="text-[10px] text-slate-400 font-medium">Updated: {tpl.lastUpdated}</span>
               <div className="flex gap-2">
                  <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Copy to clipboard">
                     <Copy className="h-4 w-4" />
                  </button>
                  <button className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors" title="Edit template">
                     <Edit className="h-4 w-4" />
                  </button>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
