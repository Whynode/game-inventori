import { InventoryStatus } from '../../types/database'

export function StatusBadge({ status }: { status: InventoryStatus }) {
 let badgeStyle = ''
 let label: string = status

 switch (status) {
 case 'UNPOSTED':
 badgeStyle = 'bg-amber-50 text-amber-600 ring-1 ring-amber-200/50'
 label = 'Unposted'
 break
 case 'AVAILABLE':
 badgeStyle = 'bg-blue-50 text-blue-600 ring-1 ring-blue-200/50'
 label = 'Available'
 break
 case 'SOLD':
 badgeStyle = 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200/50'
 label = 'Sold'
 break
 default:
 badgeStyle = 'bg-slate-50 text-slate-600 ring-1 ring-slate-200/50'
 label = 'Unknown'
 }

 return (
 <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${badgeStyle}`}>
 {label}
 </span>
 )
}
