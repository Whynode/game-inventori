'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  BarChart3,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Wallet,
  FileSpreadsheet,
} from 'lucide-react'
import { logout } from '../../actions/logout'

const navItems = [
  { label: 'Ringkasan', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Stok Akun', icon: Package, href: '/dashboard/inventory' },
  { label: 'Kelola Rekening', icon: Wallet, href: '/dashboard/accounts' },
  { label: 'Buku Kas / Ledger', icon: FileSpreadsheet, href: '/dashboard/ledger' },
  { label: 'Analitik Bisnis', icon: BarChart3, href: '/dashboard/analytics' },
  { label: 'Template Promosi', icon: FileText, href: '/dashboard/templates' },
  { label: 'Pengaturan', icon: Settings, href: '/dashboard/settings' },
]

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <aside
      className={`
        ${isCollapsed ? 'w-20' : 'w-64'}
        relative flex flex-col bg-blue-600
        transition-all duration-300 ease-in-out shrink-0
      `}
    >
      {/* Header — Brand */}
      <div className="h-[88px] px-6 flex items-center relative">
        <span
          className={`
            font-bold text-white text-2xl tracking-tight whitespace-nowrap transition-opacity duration-300
            ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}
          `}
        >
          Ferryshop
        </span>

        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`
            absolute -right-3 top-1/2 -translate-y-1/2 z-10
            h-6 w-6 rounded-full bg-white border border-slate-200 shadow-sm
            flex items-center justify-center
            text-blue-600 hover:text-blue-800
            transition-all duration-200 ease-in-out
          `}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.5} />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2.5} />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 pl-3 pr-0 space-y-1 overflow-hidden">
        {navItems.map((item) => {
          const isActive =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.label : undefined}
              className={`
                group flex items-center gap-3 px-4 py-2.5
                transition-all duration-200 ease-in-out
                ${
                  isActive
                    ? 'bg-white text-blue-600 rounded-l-2xl rounded-r-none w-full'
                    : 'text-white/80 hover:bg-white/10 hover:text-white rounded-l-2xl rounded-r-none w-full'
                }
              `}
            >
              <item.icon
                className={`h-5 w-5 shrink-0 transition-colors duration-200 ${
                  isActive
                    ? 'text-blue-600'
                    : 'text-white/80 group-hover:text-white'
                }`}
                strokeWidth={isActive ? 2 : 1.5}
              />

              <span
                className={`
                  text-sm font-medium whitespace-nowrap
                  transition-all duration-300 ease-in-out
                  ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'}
                `}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="pb-6 pt-4 pl-4 pr-0">
        <form action={logout}>
          <button
            type="submit"
            title={isCollapsed ? 'Logout' : undefined}
            className="
              w-full flex items-center gap-3 px-4 py-3
              rounded-l-full rounded-r-none
              text-white/80 hover:bg-white/10 hover:text-white
              transition-all duration-200 ease-in-out
            "
          >
            <LogOut className="h-5 w-5 shrink-0" strokeWidth={1.5} />
            <span
              className={`
                text-sm font-medium whitespace-nowrap
                transition-all duration-300 ease-in-out
                ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'}
              `}
            >
              Keluar
            </span>
          </button>
        </form>
      </div>
    </aside>
  )
}
