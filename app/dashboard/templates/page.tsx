'use client'

import { useState, useRef, useEffect } from 'react'
import {
 FileText,
 Sparkles,
 Save,
 Check,
 Eye,
 Tag,
 Heart,
 MessageCircle,
 Send,
 Bookmark,
} from 'lucide-react'

const DYNAMIC_TAGS = [
 { label: '[GAME_NAME]', preview: 'Mobile Legends' },
 { label: '[SPECS]', preview: 'Mythic Rank • 50 Skins • 90% WR' },
 { label: '[PRICE]', preview: 'Rp 750.000' },
 { label: '[REF_CODE]', preview: 'ML-MYTHIC-001' },
]

const DEFAULT_TEMPLATE = `[GAME_NAME] Account Available!

Specs:
[SPECS]

Price: [PRICE]
Ref: [REF_CODE]

DM for details!`

export default function TemplatesPage() {
 const [template, setTemplate] = useState(DEFAULT_TEMPLATE)
 const [saved, setSaved] = useState(false)
 const textareaRef = useRef<HTMLTextAreaElement>(null)

 // Load from localStorage on mount
 useEffect(() => {
 const stored = localStorage.getItem('caption_template')
 if (stored) setTemplate(stored)
 }, [])

 const insertTag = (tag: string) => {
 const textarea = textareaRef.current
 if (!textarea) return

 const start = textarea.selectionStart
 const end = textarea.selectionEnd
 const before = template.slice(0, start)
 const after = template.slice(end)
 const newValue = before + tag + after
 setTemplate(newValue)

 // Restore cursor position after the inserted tag
 requestAnimationFrame(() => {
 textarea.focus()
 const newPos = start + tag.length
 textarea.setSelectionRange(newPos, newPos)
 })
 }

 const getPreview = () => {
 let preview = template
 DYNAMIC_TAGS.forEach(tag => {
 preview = preview.replaceAll(tag.label, tag.preview)
 })
 return preview
 }

 const handleSave = () => {
 localStorage.setItem('caption_template', template)
 setSaved(true)
 setTimeout(() => setSaved(false), 2000)
 }

 return (
 <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)] flex flex-col space-y-6">
 {/* Header */}
 <div className="flex items-center justify-between">
 <div>
 <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
 Template Promosi
 </h1>
 <p className="text-sm text-slate-500 mt-1">
 Buat template caption yang bisa dipakai ulang dengan tag dinamis.
 </p>
 </div>
 <button
 onClick={handleSave}
 className={`
 inline-flex items-center space-x-2 px-5 py-2.5 text-sm font-medium rounded-lg
 transition-all duration-300
 ${
 saved
 ? 'bg-emerald-600 text-white '
 : 'bg-blue-600 text-white hover:bg-blue-700 '
 }
 `}
 >
 {saved ? (
 <>
 <Check className="h-4 w-4" strokeWidth={2.5} />
 <span>Tersimpan!</span>
 </>
 ) : (
 <>
 <Save className="h-4 w-4" strokeWidth={2} />
 <span>Simpan Template</span>
 </>
 )}
 </button>
 </div>

 {/* Two-column layout */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
 {/* Left Column — Editor */}
 <div className="flex flex-col gap-5 h-full min-h-0">
 {/* Editor Card */}
 <div className="bg-white rounded-lg border border-slate-200 flex flex-col flex-1 min-h-0">
 <div className="flex items-center gap-2 px-5 py-3.5 border-b border-slate-200 bg-slate-50/50 shrink-0">
 <FileText className="h-4 w-4 text-slate-400" strokeWidth={1.5} />
 <span className="text-sm font-medium text-slate-600">Editor Template</span>
 </div>
 <div className="p-5 flex flex-col flex-1 min-h-0">
 <textarea
 ref={textareaRef}
 value={template}
 onChange={(e) => setTemplate(e.target.value)}
 rows={12}
 placeholder="Tulis template caption di sini..."
 className="
 w-full flex-1 min-h-0 resize-none bg-slate-50/50 border border-slate-200 rounded-lg
 px-4 py-3.5 text-sm text-slate-800 leading-relaxed font-normal
 placeholder:text-slate-400
 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400
 transition-all duration-200
 "
 />
 </div>
 </div>

 {/* Dynamic Tags */}
 <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shrink-0">
 <div className="flex items-center gap-2 px-5 py-3.5 border-b border-slate-200 bg-slate-50/50">
 <Tag className="h-4 w-4 text-slate-400" strokeWidth={1.5} />
 <span className="text-sm font-medium text-slate-600">Tag Dinamis</span>
 <span className="text-xs text-slate-400 ml-auto">Klik untuk insert</span>
 </div>
 <div className="p-5">
 <div className="flex flex-wrap gap-2.5">
 {DYNAMIC_TAGS.map((tag) => (
 <button
 key={tag.label}
 onClick={() => insertTag(tag.label)}
 className={`
 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium
 bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100
 transition-colors duration-200
 active:scale-95
 `}
 >
 <Sparkles className="h-3 w-3" />
 {tag.label}
 </button>
 ))}
 </div>
 <p className="mt-4 text-xs text-slate-400 leading-relaxed">
 Tag akan diganti dengan data akun asli saat membuat caption.
 Klik tag untuk menambahkannya di posisi kursor.
 </p>
 </div>
 </div>
 </div>

 {/* Right Column — Live Preview */}
 <div className="h-full min-h-0">
 <div className="bg-white rounded-lg border border-slate-200 flex flex-col h-full min-h-0">
 <div className="flex items-center gap-2 px-5 py-3.5 border-b border-slate-200 bg-slate-50/50 shrink-0">
 <Eye className="h-4 w-4 text-slate-400" strokeWidth={1.5} />
 <span className="text-sm font-medium text-slate-600">Preview Langsung</span>
 <span className="ml-auto flex items-center gap-1 text-xs text-emerald-500 font-medium">
 <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
 Real-time
 </span>
 </div>

 {/* Phone-style preview */}
 <div className="p-5 flex-1 overflow-y-auto">
 <div className="mx-auto max-w-sm">
 {/* Social media post frame */}
 <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
 {/* Post header */}
 <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200">
 <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center ">
 <span className="text-white text-xs font-bold">GI</span>
 </div>
 <div className="flex-1 min-w-0">
 <p className="text-sm font-semibold text-slate-900 truncate">
 GameInventory
 </p>
 <p className="text-xs text-slate-400">Baru saja</p>
 </div>
 <div className="text-slate-300">•••</div>
 </div>

 {/* Post body */}
 <div className="px-4 py-4">
 <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed break-words">
 {getPreview()}
 </p>
 </div>

 {/* Post footer */}
 <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200">
 <div className="flex items-center gap-5">
 <button className="text-slate-400 hover:text-rose-500 transition-colors">
 <Heart className="h-5 w-5" strokeWidth={1.5} />
 </button>
 <button className="text-slate-400 hover:text-blue-500 transition-colors">
 <MessageCircle className="h-5 w-5" strokeWidth={1.5} />
 </button>
 <button className="text-slate-400 hover:text-blue-500 transition-colors">
 <Send className="h-5 w-5" strokeWidth={1.5} />
 </button>
 </div>
 <button className="text-slate-400 hover:text-slate-600 transition-colors">
 <Bookmark className="h-5 w-5" strokeWidth={1.5} />
 </button>
 </div>
 </div>

 {/* Caption below preview */}
 <p className="text-center text-xs text-slate-400 mt-4">
 Preview menunjukkan bagaimana tampilan caption di media sosial
 </p>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 )
}
