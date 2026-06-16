import { ReactNode } from 'react'
import Sidebar from '../../components/layout/Sidebar'

export default function DashboardLayout({ children }: { children: ReactNode }) {
 return (
 <div className="flex h-screen overflow-hidden">
 <Sidebar />

 {/* Main Content Area */}
 <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300">
 {/* Header */}
 <header className="h-16 bg-gradient-to-r from-white via-blue-50/40 to-slate-50 border-b border-slate-200 shrink-0" />

 {/* Scrollable Main */}
 <main className="flex-1 overflow-y-auto bg-slate-50 p-8 transition-all duration-300">
 {children}
 </main>
 </div>
 </div>
 )
}
