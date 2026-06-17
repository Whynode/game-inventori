'use server'

import { createClient } from '@/lib/supabase/server'
import { DealWithRelations, Deal } from '@/types/database'
import { revalidatePath } from 'next/cache'

export async function getDeals(): Promise<{ data: DealWithRelations[] | null; error: string | null }> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('deals')
      .select('*, stock:stocks(*), payments(*), admin:public_users(*)')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return { data: data as DealWithRelations[], error: null }
  } catch (error: any) {
    console.error('Error fetching deals:', error)
    return { data: null, error: error.message || 'An unexpected error occurred' }
  }
}

export async function getDealById(id: string): Promise<{ data: DealWithRelations | null; error: string | null }> {
  try {
    const supabase = await createClient()
    // Need a slightly deeper join to get account details for each payment
    const { data, error } = await supabase
      .from('deals')
      .select(`
        *, 
        stock:stocks(*), 
        payments(
          *, 
          account:accounts(*), 
          admin:public_users(*)
        ), 
        admin:public_users(*)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return { data: data as unknown as DealWithRelations, error: null }
  } catch (error: any) {
    console.error('Error fetching deal:', error)
    return { data: null, error: error.message || 'An unexpected error occurred' }
  }
}

export async function createDeal(
  stockId: string, 
  customerName: string, 
  customerContact: string, 
  dealPrice: number
): Promise<{ data: Deal | null; error: string | null }> {
  try {
    if (dealPrice <= 0) {
      return { data: null, error: 'Harga deal harus lebih besar dari 0' }
    }
    if (!customerName.trim()) {
      return { data: null, error: 'Nama customer wajib diisi' }
    }

    const supabase = await createClient()
    
    // Generate a simple deal number (e.g. DEAL-TIMESTAMP)
    const dealNumber = `DEAL-${Date.now()}`
    
    const { data, error } = await supabase
      .from('deals')
      .insert({
        deal_number: dealNumber,
        stock_id: stockId,
        customer_name: customerName,
        customer_contact: customerContact,
        deal_price: dealPrice,
        remaining_balance: dealPrice,
        status: 'DRAFT'
      })
      .select()
      .single()
      
    if (error) throw error
    
    revalidatePath('/dashboard/deals', 'page')
    return { data: data as Deal, error: null }
  } catch (error: any) {
    console.error('Error creating deal:', error)
    return { data: null, error: error.message || 'An unexpected error occurred' }
  }
}

export async function addPayment(
  dealId: string,
  accountId: string,
  amount: number,
  notes: string = ''
): Promise<{ success: boolean; error: string | null }> {
  try {
    if (amount <= 0) {
      return { success: false, error: 'Jumlah pembayaran harus lebih besar dari 0' }
    }

    const supabase = await createClient()
    
    // Attempt to grab admin ID if user is authenticated
    const { data: { session } } = await supabase.auth.getSession()
    const adminId = session?.user?.id || null
    
    // Call the RPC we just created via MCP!
    const { error } = await supabase.rpc('process_payment', {
      p_deal_id: dealId,
      p_account_id: accountId,
      p_amount: amount,
      p_notes: notes,
      p_admin_id: adminId
    })
    
    if (error) throw error
    
    revalidatePath('/dashboard/deals')
    revalidatePath(`/dashboard/deals/${dealId}`)
    return { success: true, error: null }
  } catch (error: any) {
    console.error('Error processing payment:', error)
    return { success: false, error: error.message || 'An unexpected error occurred' }
  }
}

export async function cancelDeal(
  dealId: string,
  stockId: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = await createClient()

    // 1. Update deal status to CANCELLED_BY_BUYER
    const { error: dealError } = await supabase
      .from('deals')
      .update({ status: 'CANCELLED_BY_BUYER', updated_at: new Date().toISOString() })
      .eq('id', dealId)
      
    if (dealError) throw dealError

    // 2. Return the stock back to AVAILABLE
    const { error: stockError } = await supabase
      .from('stocks')
      .update({ status: 'AVAILABLE', updated_at: new Date().toISOString() })
      .eq('id', stockId)

    if (stockError) throw stockError

    revalidatePath('/dashboard/deals')
    revalidatePath(`/dashboard/deals/${dealId}`)
    revalidatePath('/dashboard/inventory')
    
    return { success: true, error: null }
  } catch (error: any) {
    console.error('Error cancelling deal:', error)
    return { success: false, error: error.message || 'An unexpected error occurred' }
  }
}
