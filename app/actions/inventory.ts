'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getInventory() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('stocks').select('*').order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching inventory:', error)
    throw new Error('Gagal memuat data stok.')
  }
  
  return data
}

export async function addStock(formData: FormData) {
  const category = formData.get('category') as string
  const sku = formData.get('sku') as string
  const name = formData.get('name') as string
  const capital_price = parseFloat(formData.get('capital_price') as string) || 0
  const post_price = parseFloat(formData.get('post_price') as string) || 0
  const login_info = formData.get('login_info') as string

  if (!category || !name) {
    throw new Error('Kategori dan Nama Akun wajib diisi.')
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // Create a unique SKU if not provided
  let finalSku = sku
  if (!finalSku) {
    finalSku = `STK-${Date.now().toString().slice(-6)}`
  }
  
  const { error } = await supabase.from('stocks').insert({
    category,
    sku: finalSku,
    name,
    capital_price,
    post_price,
    current_price: post_price,
    login_info,
    status: 'Tersedia',
    managed_by: user?.id || null
  })

  if (error) {
    console.error('Error adding stock:', error)
    if (error.code === '23505') {
      throw new Error('Kode SKU sudah digunakan, harap gunakan yang lain.')
    }
    throw new Error('Gagal menambahkan stok baru.')
  }

  revalidatePath('/dashboard/inventory')
}
