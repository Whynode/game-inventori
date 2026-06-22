'use client'

import React, { useState, useEffect } from 'react'
import { Search, Filter, Calendar, ChevronDown, Download, Loader2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { getAuditLogs } from '@/app/actions/audit-log'

export default function AuditLogPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    const logsData = await getAuditLogs()
    setLogs(logsData || [])
    setIsLoading(false)
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Audit Log</h1>
          <p className="text-sm text-slate-500 mt-0.5">Catatan aktivitas admin, perubahan data, dan akses sistem (Read-only).</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm">
            <Download className="h-4 w-4" />
            Export CSV
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
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-900 placeholder-slate-400 bg-slate-50 outline-none transition-all"
            placeholder="Cari keterangan aktivitas atau user..."
          />
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <button className="inline-flex items-center justify-between gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 flex-1 sm:flex-none">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <span>Semua User</span>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>
          <button className="inline-flex items-center justify-between gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 flex-1 sm:flex-none">
            <span>Semua Modul</span>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>
          <button className="inline-flex items-center justify-between gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span>Hari Ini</span>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Table Dense Layout */}
      <div className="bg-white border border-slate-100 shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50/80">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Waktu
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  User & Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Modul
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Aksi
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Keterangan Detail
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {isLoading ? (
                 <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                       <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
                    </td>
                 </tr>
              ) : logs.length === 0 ? (
                 <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-500">
                       Belum ada catatan aktivitas.
                    </td>
                 </tr>
              ) : (
                logs.map((log) => {
                  let actionColor = 'text-slate-600 bg-slate-100'
                  if (log.action === 'CREATE') actionColor = 'text-emerald-700 bg-emerald-50'
                  if (log.action === 'UPDATE') actionColor = 'text-blue-700 bg-blue-50'
                  if (log.action === 'DELETE') actionColor = 'text-rose-700 bg-rose-50'
                  if (log.action === 'LOGIN') actionColor = 'text-purple-700 bg-purple-50'

                  return (
                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-2.5 whitespace-nowrap text-xs text-slate-500 font-mono">
                        {formatDate(log.created_at)}
                      </td>
                      <td className="px-6 py-2.5 whitespace-nowrap text-xs font-semibold text-slate-800">
                        {log.users?.full_name || 'System / Deleted User'}
                      </td>
                      <td className="px-6 py-2.5 whitespace-nowrap text-xs text-slate-600 font-medium">
                        {log.module}
                      </td>
                      <td className="px-6 py-2.5 whitespace-nowrap">
                        <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider ${actionColor}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-2.5 text-xs text-slate-600 font-mono tracking-tight max-w-md truncate" title={log.description}>
                        {log.description}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

