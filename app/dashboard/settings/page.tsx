import React from 'react'
import { Users, Gamepad2, Shield, Plus, MoreHorizontal } from 'lucide-react'

// Mock Data
const mockUsers = [
  { id: 'USR-001', name: 'Farhan Maulana', email: 'farhan@feryshop.com', role: 'Owner', status: 'Aktif' },
  { id: 'USR-002', name: 'Budi Santoso', email: 'budi@feryshop.com', role: 'Admin CS', status: 'Aktif' },
  { id: 'USR-003', name: 'Siti Rahma', email: 'siti@feryshop.com', role: 'Admin Keuangan', status: 'Aktif' },
  { id: 'USR-004', name: 'Deni Setiawan', email: 'deni@feryshop.com', role: 'Admin Stok', status: 'Nonaktif' },
]

const mockCategories = [
  { id: 'CAT-001', name: 'Mobile Legends', count: 45, status: 'Aktif' },
  { id: 'CAT-002', name: 'Free Fire', count: 32, status: 'Aktif' },
  { id: 'CAT-003', name: 'PUBG Mobile', count: 28, status: 'Aktif' },
  { id: 'CAT-004', name: 'Genshin Impact', count: 15, status: 'Aktif' },
  { id: 'CAT-005', name: 'Valorant', count: 8, status: 'Aktif' },
]

export default function SettingsPage() {
  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Pengaturan Sistem</h1>
        <p className="text-sm text-slate-500 mt-0.5">Konfigurasi user, role, dan data master sistem Feryshop.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sidebar Nav (Static Mock) */}
        <div className="lg:col-span-3 flex flex-col gap-2">
          <button className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg font-semibold border border-blue-100 transition-colors text-sm text-left">
             <Users className="h-5 w-5" /> Manajemen User
          </button>
          <button className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors text-sm text-left">
             <Shield className="h-5 w-5" /> Hak Akses / Role
          </button>
          <button className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors text-sm text-left mt-4">
             <Gamepad2 className="h-5 w-5" /> Kategori Game
          </button>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9 flex flex-col gap-6">
          
          {/* USER MANAGEMENT SECTION */}
          <div className="bg-white border border-slate-100 shadow-sm rounded-xl overflow-hidden">
             <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-800">Daftar Pengguna (Admin)</h2>
                <button className="inline-flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus className="h-3 w-3" /> Tambah Admin
                </button>
             </div>
             <div className="p-0">
               <table className="min-w-full divide-y divide-slate-100">
                  <thead className="bg-white">
                     <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Nama & Email</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {mockUsers.map(user => (
                        <tr key={user.id} className="hover:bg-slate-50/50">
                           <td className="px-6 py-4">
                              <div className="flex flex-col">
                                 <span className="text-sm font-semibold text-slate-900">{user.name}</span>
                                 <span className="text-xs text-slate-500">{user.email}</span>
                              </div>
                           </td>
                           <td className="px-6 py-4 text-sm font-medium text-slate-700">{user.role}</td>
                           <td className="px-6 py-4 text-center">
                              <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${user.status === 'Aktif' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                                 {user.status}
                              </span>
                           </td>
                           <td className="px-6 py-4 text-center text-sm">
                              <button className="text-blue-600 hover:text-blue-800 font-semibold text-xs">Edit</button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
             </div>
          </div>

          {/* GAME CATEGORIES SECTION */}
          <div className="bg-white border border-slate-100 shadow-sm rounded-xl overflow-hidden mt-2">
             <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-800">Master Kategori Game</h2>
                <button className="inline-flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <Plus className="h-3 w-3" /> Tambah Kategori
                </button>
             </div>
             <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {mockCategories.map(cat => (
                   <div key={cat.id} className="border border-slate-200 rounded-lg p-4 flex items-center justify-between hover:border-blue-300 transition-colors group cursor-pointer">
                      <div>
                         <h3 className="text-sm font-bold text-slate-800">{cat.name}</h3>
                         <p className="text-xs text-slate-500 mt-0.5">{cat.count} Stok Tersedia</p>
                      </div>
                      <MoreHorizontal className="h-4 w-4 text-slate-300 group-hover:text-blue-500" />
                   </div>
                ))}
             </div>
          </div>

        </div>
      </div>
    </div>
  )
}
