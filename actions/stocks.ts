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
    return { data: data as Stock[], error: null }
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
    return { data: data as Stock[], error: null }
  } catch (error: any) {
    console.error('Error fetching available stocks:', error)
    return { data: null, error: error.message || 'An unexpected error occurred' }
  }
}

export async function createStock(stockData: Partial<Stock>): Promise<{ data: Stock | null; error: string | null }> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('stocks')
      .insert(stockData)
      .select()
      .single()
    
    if (error) throw error
    
    revalidatePath('/dashboard/inventory')
    return { data: data as Stock, error: null }
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
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    
    revalidatePath('/dashboard/inventory')
    return { data: data as Stock, error: null }
  } catch (error: any) {
    console.error('Error updating stock status:', error)
    return { data: null, error: error.message || 'An unexpected error occurred' }
  }
}

export async function updateStock(id: string, stockData: Partial<Stock>): Promise<{ data: Stock | null; error: string | null }> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('stocks')
      .update({ ...stockData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    
    revalidatePath('/dashboard/inventory')
    return { data: data as Stock, error: null }
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
