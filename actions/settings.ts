'use server'

import { createClient } from '../lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addGameCategory(name: string, slug: string, image_url?: string) {
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
    ...(image_url ? { image_url } : {})
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
  revalidatePath('/dashboard/inventory')
  
  return { success: true }
}

export async function updateGameCategory(id: string, name: string, slug: string, image_url?: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Unauthorized' }
  }

  if (!id || !name || !slug) {
    return { success: false, error: 'ID, Name, and Slug are required.' }
  }

  const { error } = await supabase.from('games').update({
    name,
    slug,
    image_url: image_url || null
  }).eq('id', id)

  if (error) {
    console.error('Database Error:', error)
    if (error.code === '23505') {
      return { success: false, error: 'Kategori game dengan slug ini sudah ada.' }
    }
    return { success: false, error: 'Gagal mengupdate kategori game.' }
  }

  revalidatePath('/dashboard/settings')
  revalidatePath('/dashboard/inventory')
  
  return { success: true }
}

export async function deleteGameCategory(id: string) {
  // Use admin client to bypass RLS for destructive mutations
  const { createAdminClient } = await import('../lib/supabase/admin')
  const supabase = createAdminClient()

  if (!id) {
    return { success: false, error: 'ID is required.' }
  }

  const { error, data } = await supabase
    .from('games')
    .delete()
    .eq('id', id)
    .select()

  if (error) {
    console.error('[deleteGameCategory] DB Error:', error.message, error.code, error.details)
    return { success: false, error: `Gagal menghapus: ${error.message}` }
  }

  console.log(`[deleteGameCategory] Deleted game id=${id}, rows returned:`, data?.length ?? 0)

  revalidatePath('/dashboard/settings')
  revalidatePath('/dashboard/inventory')
  
  return { success: true }
}

