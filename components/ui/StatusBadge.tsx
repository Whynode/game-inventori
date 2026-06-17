import { StockStatus } from '@/types/database'

export function StatusBadge({ status }: { status: StockStatus }) {
  let badgeStyle = ''
  let label: string = status

  switch (status) {
    case 'AVAILABLE':
      badgeStyle = 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200/50'
      label = 'Tersedia'
      break
    case 'BOOKED':
      badgeStyle = 'bg-amber-50 text-amber-600 ring-1 ring-amber-200/50'
      label = 'Booking'
      break
    case 'LIMITED_ACCESS':
      badgeStyle = 'bg-purple-50 text-purple-600 ring-1 ring-purple-200/50'
      label = 'Akses Terbatas'
      break
    case 'SOLD':
      badgeStyle = 'bg-blue-50 text-blue-600 ring-1 ring-blue-200/50'
      label = 'Terjual'
      break
    case 'ON_HOLD':
      badgeStyle = 'bg-slate-50 text-slate-600 ring-1 ring-slate-200/50'
      label = 'On Hold'
      break
    case 'PROBLEM_ACTION':
      badgeStyle = 'bg-red-50 text-red-600 ring-1 ring-red-200/50'
      label = 'Bermasalah (Tindak Lanjut)'
      break
    case 'PROBLEM_PERMANENT':
      badgeStyle = 'bg-rose-100 text-rose-700 ring-1 ring-rose-300'
      label = 'Bermasalah (Permanen)'
      break
    case 'CANCELLED':
      badgeStyle = 'bg-gray-100 text-gray-500 ring-1 ring-gray-200/50'
      label = 'Cancel'
      break
    default:
      badgeStyle = 'bg-slate-50 text-slate-600 ring-1 ring-slate-200/50'
      label = status
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-[10px] text-xs font-medium ${badgeStyle}`}>
      {label}
    </span>
  )
}
