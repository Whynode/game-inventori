import { createClient } from '@/lib/supabase/server'
import { AddInventoryForm } from '@/components/features/AddInventoryForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AddInventoryPage() {
 const supabase = await createClient()

 // Fetch games for the dropdown
 const { data: games, error } = await supabase
 .from('games')
 .select('id, name')
 .order('name')

 return (
 <div className="max-w-4xl mx-auto space-y-8">
 {/* Header */}
 <div className="flex items-center space-x-4">
 <Link 
 href="/dashboard/inventory"
 className="p-2 bg-white border border-slate-200 rounded-[10px] text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors "
 >
 <ArrowLeft className="h-5 w-5" />
 </Link>
 <div>
 <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Add New Account</h1>
 <p className="text-sm text-slate-500 mt-1">Input details for the newly acquired inventory.</p>
 </div>
 </div>

 {/* Form Container */}
 <div className="bg-white p-8 rounded-[10px] border border-slate-200">
 <AddInventoryForm games={games || []} />
 </div>
 </div>
 )
}
