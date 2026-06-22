'use server'

import { createClient } from '@/lib/supabase/server'
import { Stock, StockStatus } from '@/types/database'
import { revalidatePath } from 'next/cache'

export async function getStocks(): Promise<{ data: Stock[] | null; error: string | null }> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('stocks')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error

    const mapped = (data || []).map((row: any) => ({
      id: row.id,
      category: row.category,
      name: row.name,
      account_details: row.account_detail,
      username: row.login_info,
      password: row.password_info,
      backup_code: row.backup_code,
      capital_price: Number(row.capital_price),
      post_price: Number(row.post_price),
      promo_price: row.promo_price ? Number(row.promo_price) : null,
      current_price: Number(row.current_price),
      status: row.status as any,
      purchase_payment_status: row.purchase_payment_status || 'LUNAS',
      payment_account_id: row.payment_account_id || null,
      purchase_date: row.purchase_date || null,
      post_date: row.post_date || null,
      booking_date: row.booking_date || null,
      sold_date: row.sold_date || null,
      seller_info: row.seller_info,
      buyer_info: row.buyer_info || null,
      internal_notes: row.notes,
      images: row.images || [],
      admin_id: row.managed_by,
      created_at: row.created_at || '',
      updated_at: row.updated_at || ''
    })) as Stock[]

    return { data: mapped, error: null }
  } catch (error: any) {
    console.error('Error fetching stocks:', error)
    return { data: null, error: error.message || 'An unexpected error occurred' }
  }
}

export async function getAvailableStocks(): Promise<{ data: Stock[] | null; error: string | null }> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('stocks')
      .select('*')
      .eq('status', 'AVAILABLE')
      .order('created_at', { ascending: false })
    
    if (error) throw error

    const mapped = (data || []).map((row: any) => ({
      id: row.id,
      category: row.category,
      name: row.name,
      account_details: row.account_detail,
      username: row.login_info,
      password: row.password_info,
      backup_code: row.backup_code,
      capital_price: Number(row.capital_price),
      post_price: Number(row.post_price),
      promo_price: row.promo_price ? Number(row.promo_price) : null,
      current_price: Number(row.current_price),
      status: row.status as any,
      purchase_payment_status: row.purchase_payment_status || 'LUNAS',
      payment_account_id: row.payment_account_id || null,
      purchase_date: row.purchase_date || null,
      post_date: row.post_date || null,
      booking_date: row.booking_date || null,
      sold_date: row.sold_date || null,
      seller_info: row.seller_info,
      buyer_info: row.buyer_info || null,
      internal_notes: row.notes,
      images: row.images || [],
      admin_id: row.managed_by,
      created_at: row.created_at || '',
      updated_at: row.updated_at || ''
    })) as Stock[]

    return { data: mapped, error: null }
  } catch (error: any) {
    console.error('Error fetching available stocks:', error)
    return { data: null, error: error.message || 'An unexpected error occurred' }
  }
}

export async function createStock(stockData: Partial<Stock>): Promise<{ data: Stock | null; error: string | null }> {
  try {
    const supabase = await createClient()

    const dbInsertData = {
      category: stockData.category || '',
      name: stockData.name || '',
      account_detail: stockData.account_details || null,
      login_info: stockData.username || null,
      password_info: stockData.password || null,
      backup_code: stockData.backup_code || null,
      capital_price: stockData.capital_price ?? 0,
      post_price: stockData.post_price ?? 0,
      current_price: stockData.current_price ?? 0,
      status: stockData.status || 'AVAILABLE',
      seller_info: stockData.seller_info || null,
      notes: stockData.internal_notes || null,
      managed_by: stockData.admin_id || null,
      sku: (stockData as any).sku || `STK-${Date.now()}`,
      images: stockData.images || []
    }

    const { data, error } = await supabase
      .from('stocks')
      .insert(dbInsertData as any)
      .select()
      .single()
    
    if (error) throw error
    
    const row = data as any
    const mapped: Stock = {
      id: row.id,
      category: row.category,
      name: row.name,
      account_details: row.account_detail,
      username: row.login_info,
      password: row.password_info,
      backup_code: row.backup_code,
      capital_price: Number(row.capital_price),
      post_price: Number(row.post_price),
      promo_price: row.promo_price ? Number(row.promo_price) : null,
      current_price: Number(row.current_price),
      status: row.status as any,
      purchase_payment_status: row.purchase_payment_status || 'LUNAS',
      payment_account_id: row.payment_account_id || null,
      purchase_date: row.purchase_date || null,
      post_date: row.post_date || null,
      booking_date: row.booking_date || null,
      sold_date: row.sold_date || null,
      seller_info: row.seller_info,
      buyer_info: row.buyer_info || null,
      internal_notes: row.notes,
      images: row.images || [],
      admin_id: row.managed_by,
      created_at: row.created_at || '',
      updated_at: row.updated_at || ''
    }
    
    revalidatePath('/dashboard/inventory')
    return { data: mapped, error: null }
  } catch (error: any) {
    console.error('Error creating stock:', error)
    return { data: null, error: error.message || 'An unexpected error occurred' }
  }
}

export async function updateStockStatus(id: string, status: StockStatus): Promise<{ data: Stock | null; error: string | null }> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('stocks')
      .update({ status, updated_at: new Date().toISOString() } as any)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    
    const row = data as any
    const mapped: Stock = {
      id: row.id,
      category: row.category,
      name: row.name,
      account_details: row.account_detail,
      username: row.login_info,
      password: row.password_info,
      backup_code: row.backup_code,
      capital_price: Number(row.capital_price),
      post_price: Number(row.post_price),
      promo_price: row.promo_price ? Number(row.promo_price) : null,
      current_price: Number(row.current_price),
      status: row.status as any,
      purchase_payment_status: row.purchase_payment_status || 'LUNAS',
      payment_account_id: row.payment_account_id || null,
      purchase_date: row.purchase_date || null,
      post_date: row.post_date || null,
      booking_date: row.booking_date || null,
      sold_date: row.sold_date || null,
      seller_info: row.seller_info,
      buyer_info: row.buyer_info || null,
      internal_notes: row.notes,
      images: row.images || [],
      admin_id: row.managed_by,
      created_at: row.created_at || '',
      updated_at: row.updated_at || ''
    }
    
    revalidatePath('/dashboard/inventory')
    return { data: mapped, error: null }
  } catch (error: any) {
    console.error('Error updating stock status:', error)
    return { data: null, error: error.message || 'An unexpected error occurred' }
  }
}

export async function updateStock(id: string, stockData: Partial<Stock>): Promise<{ data: Stock | null; error: string | null }> {
  try {
    const supabase = await createClient()
    
    const dbUpdateData: any = {}
    if (stockData.category !== undefined) dbUpdateData.category = stockData.category
    if (stockData.name !== undefined) dbUpdateData.name = stockData.name
    if (stockData.account_details !== undefined) dbUpdateData.account_detail = stockData.account_details
    if (stockData.username !== undefined) dbUpdateData.login_info = stockData.username
    if (stockData.password !== undefined) dbUpdateData.password_info = stockData.password
    if (stockData.backup_code !== undefined) dbUpdateData.backup_code = stockData.backup_code
    if (stockData.capital_price !== undefined) dbUpdateData.capital_price = stockData.capital_price
    if (stockData.post_price !== undefined) dbUpdateData.post_price = stockData.post_price
    if (stockData.current_price !== undefined) dbUpdateData.current_price = stockData.current_price
    if (stockData.status !== undefined) dbUpdateData.status = stockData.status
    if (stockData.seller_info !== undefined) dbUpdateData.seller_info = stockData.seller_info
    if (stockData.internal_notes !== undefined) dbUpdateData.notes = stockData.internal_notes
    if (stockData.admin_id !== undefined) dbUpdateData.managed_by = stockData.admin_id
    if (stockData.images !== undefined) dbUpdateData.images = stockData.images
    
    dbUpdateData.updated_at = new Date().toISOString()

    const { data, error } = await supabase
      .from('stocks')
      .update(dbUpdateData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    
    const row = data as any
    const mapped: Stock = {
      id: row.id,
      category: row.category,
      name: row.name,
      account_details: row.account_detail,
      username: row.login_info,
      password: row.password_info,
      backup_code: row.backup_code,
      capital_price: Number(row.capital_price),
      post_price: Number(row.post_price),
      promo_price: row.promo_price ? Number(row.promo_price) : null,
      current_price: Number(row.current_price),
      status: row.status as any,
      purchase_payment_status: row.purchase_payment_status || 'LUNAS',
      payment_account_id: row.payment_account_id || null,
      purchase_date: row.purchase_date || null,
      post_date: row.post_date || null,
      booking_date: row.booking_date || null,
      sold_date: row.sold_date || null,
      seller_info: row.seller_info,
      buyer_info: row.buyer_info || null,
      internal_notes: row.notes,
      images: row.images || [],
      admin_id: row.managed_by,
      created_at: row.created_at || '',
      updated_at: row.updated_at || ''
    }

    revalidatePath('/dashboard/inventory')
    return { data: mapped, error: null }
  } catch (error: any) {
    console.error('Error updating stock:', error)
    return { data: null, error: error.message || 'An unexpected error occurred' }
  }
}

export async function deleteStock(id: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = await createClient()
    
    // First check the stock's status
    const { data: stock, error: fetchError } = await supabase
      .from('stocks')
      .select('status')
      .eq('id', id)
      .single()
      
    if (fetchError) throw fetchError
    
    if (stock.status === 'SOLD') {
      return { success: false, error: 'Cannot delete a stock that has already been sold (TERJUAL).' }
    }

    const { error } = await supabase
      .from('stocks')
      .delete()
      .eq('id', id)
    
    if (error) {
      if (error.code === '23503') { // Foreign key constraint violation
        return { success: false, error: 'Cannot delete this stock because it is already linked to a Deal/Transaction.' }
      }
      throw error
    }
    
    revalidatePath('/dashboard/inventory')
    return { success: true, error: null }
  } catch (error: any) {
    console.error('Error deleting stock:', error)
    return { success: false, error: error.message || 'An unexpected error occurred' }
  }
}
