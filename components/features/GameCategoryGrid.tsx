'use client'

import Link from 'next/link'

interface GameCategory {
  id: string
  name: string
  slug: string
  activeCount: number
}

export function GameCategoryGrid({ categories }: { categories: GameCategory[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {categories.map((category) => (
        <Link
          href={`/dashboard/inventory/category/${category.slug}`}
          key={category.id}
          className="group relative bg-white rounded-[10px] border border-slate-200 p-4 hover:bg-slate-50 transition-colors duration-200"
        >
          {/* Image Frame */}
          <div className="aspect-video w-full bg-slate-50 border border-slate-200 rounded-[10px] flex items-center justify-center mb-4 group-hover:border-slate-300 transition-colors">
            <span className="text-xs text-slate-400">Bingkai Gambar</span>
          </div>

          {/* Content */}
          <div>
            <h3 className="text-sm font-semibold text-slate-800 leading-tight">
              {category.name}
            </h3>
            <div className="mt-2 flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded-[10px] text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                {category.activeCount} siap jual
              </span>
            </div>
          </div>

          {/* Decorative dot */}
          <div
            className={`
              absolute top-4 right-4 h-2 w-2 rounded-[10px]
              ${category.activeCount > 0 ? 'bg-emerald-400' : 'bg-slate-300'}
            `}
          />
        </Link>
      ))}
    </div>
  )
}
