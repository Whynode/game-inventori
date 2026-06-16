'use server'

import { createClient } from '../lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addGameCategory(name: string, slug: string) {
 const supabase = await createClient()

 // Ensure user is authenticated and authorized (e.g., SUPER_ADMIN or ADMIN, but here we just check if user exists)
 const { data: { user } } = await supabase.auth.getUser()
 if (!user) {
 return { success: false, error: 'Unauthorized' }
 }

 // Basic validation
 if (!name || !slug) {
 return { success: false, error: 'Name and Slug are required.' }
 }

 // Insert into games table
 const { error } = await supabase.from('games').insert({
 name,
 slug,
 })

 if (error) {
 console.error('Database Error:', error)
 // Handle unique constraint violation gracefully if possible, or generic error
 if (error.code === '23505') {
 return { success: false, error: 'Kategori game dengan slug ini sudah ada.' }
 }
 return { success: false, error: 'Gagal menambahkan kategori game.' }
 }

 // Revalidate relevant paths
 revalidatePath('/dashboard/settings')
 revalidatePath('/dashboard/inventory/new')
 revalidatePath('/dashboard/inventory')
 
 return { success: true }
}
