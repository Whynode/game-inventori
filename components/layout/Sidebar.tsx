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
} from 'lucide-react'
import { logout } from '../../actions/logout'

const navItems = [
 { label: 'Ringkasan', icon: LayoutDashboard, href: '/dashboard' },
 { label: 'Stok Akun', icon: Package, href: '/dashboard/inventory' },
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
 relative flex flex-col bg-white border-r border-slate-200
 transition-all duration-300 ease-in-out shrink-0
 `}
 >
 {/* Header — Brand */}
 <div className="h-16 flex items-center px-6 border-b border-slate-200 relative">
 <span
 className={`
 font-bold text-slate-900 text-lg tracking-tight whitespace-nowrap transition-opacity duration-300
 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}
 `}
 >
 GameInventory
 </span>

 {/* Toggle Button */}
 <button
 onClick={() => setIsCollapsed(!isCollapsed)}
 className={`
 absolute -right-3 top-5 z-10
 h-6 w-6 rounded-full bg-white border border-slate-200
 flex items-center justify-center
 text-slate-400 hover:text-slate-700
 transition-all duration-200 ease-in-out
 `}
 aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
 >
 {isCollapsed ? (
 <ChevronRight className="h-3.5 w-3.5" strokeWidth={2} />
 ) : (
 <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2} />
 )}
 </button>
 </div>

 {/* Navigation */}
 <nav className="flex-1 p-3 space-y-1 overflow-hidden">
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
 group relative flex items-center gap-3 rounded-lg px-3 py-2.5
 transition-all duration-200 ease-in-out
 ${
 isActive
 ? 'bg-blue-50 text-blue-600'
 : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
 }
 `}
 >
 {/* Active indicator bar */}
 {isActive && (
 <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-r-full bg-blue-600" />
 )}

 <item.icon
 className={`h-5 w-5 shrink-0 transition-colors duration-200 ${
 isActive
 ? 'text-blue-600'
 : 'text-slate-400 group-hover:text-slate-600'
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
 <div className="p-3 border-t border-slate-200">
 <form action={logout}>
 <button
 type="submit"
 title={isCollapsed ? 'Logout' : undefined}
 className="
 w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
 text-slate-400 hover:bg-rose-50 hover:text-rose-600
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
