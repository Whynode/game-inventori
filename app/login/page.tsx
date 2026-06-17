'use client'

import { useState, useTransition } from 'react'
import { login } from '@/actions/auth'
import { Mail, Lock, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
 const [error, setError] = useState<string | null>(null)
 const [isPending, startTransition] = useTransition()
 const router = useRouter()

 const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
 e.preventDefault()
 setError(null)
 const formData = new FormData(e.currentTarget)

 startTransition(async () => {
 const result = await login(formData)
 if (result?.success) {
 router.push('/dashboard')
 } else {
 setError(result?.error || 'An unexpected error occurred.')
 }
 })
 }

 return (
 <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50/80 via-[#F8FAFC] to-[#F8FAFC] p-4">
 <div className="w-full max-w-md bg-white rounded-[10px] p-8 border border-slate-200">
 <div className="mb-8 text-center">
 <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Welcome Back</h1>
 <p className="text-sm text-slate-500 mt-2">Sign in to your admin dashboard</p>
 </div>

 <form onSubmit={handleSubmit} className="space-y-6">
 {error && (
 <div className="p-3 text-sm text-rose-600 bg-rose-50 rounded-[10px] ring-1 ring-rose-200">
 {error}
 </div>
 )}

 <div className="space-y-4">
 <div>
 <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="email">
 Email Address
 </label>
 <div className="relative">
 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
 <Mail className="h-5 w-5 text-slate-400" strokeWidth={1.5} />
 </div>
 <input
 id="email"
 name="email"
 type="email"
 autoComplete="email"
 required
 className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 placeholder-slate-400 transition-colors"
 placeholder="admin@example.com"
 />
 </div>
 </div>

 <div>
 <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="password">
 Password
 </label>
 <div className="relative">
 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
 <Lock className="h-5 w-5 text-slate-400" strokeWidth={1.5} />
 </div>
 <input
 id="password"
 name="password"
 type="password"
 autoComplete="current-password"
 required
 className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 placeholder-slate-400 transition-colors"
 placeholder="••••••••"
 />
 </div>
 </div>
 </div>

 <button
 type="submit"
 disabled={isPending}
 className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-[10px] text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
 >
 {isPending ? (
 <Loader2 className="animate-spin h-5 w-5" />
 ) : (
 'Sign In'
 )}
 </button>
 </form>
 </div>
 </div>
 )
}
