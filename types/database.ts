// ============================================================================
// ENUMS
// ============================================================================

export type UserRole = 'OWNER' | 'ADMIN' | 'VIEWER';
export type StockStatus = 'AVAILABLE' | 'BOOKED' | 'LIMITED_ACCESS' | 'SOLD' | 'ON_HOLD' | 'PROBLEM_ACTION' | 'PROBLEM_PERMANENT' | 'CANCELLED';
export type PurchasePaymentStatus = 'LUNAS' | 'PENDING';
export type DealStatus = 'DRAFT' | 'BOOKED' | 'LIMITED_ACCESS' | 'PAID' | 'CANCELLED_BY_BUYER' | 'CANCELLED_BY_SELLER' | 'REFUND_PARTIAL' | 'REFUND_FULL' | 'PROBLEM' | 'COMPLETED';
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
export type PaymentType = 'IN' | 'OUT';
export type LedgerTransactionType = 'PAYMENT_IN' | 'PAYMENT_OUT' | 'REFUND' | 'CASHBACK' | 'TRANSFER_IN' | 'TRANSFER_OUT' | 'STOCK_PURCHASE' | 'ADJUSTMENT';

// ============================================================================
// INTERFACES
// ============================================================================

export interface Role {
  id: string; // UUID
  name: string;
  permissions: Record<string, any>; // JSONB
  created_at: string;
  updated_at: string;
}

export interface PublicUser {
  id: string; // UUID (matches auth.users)
  full_name: string;
  role_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Account {
  id: string; // UUID
  name: string;
  account_number: string | null;
  image_url: string | null;
  balance: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Stock {
  id: string; // UUID
  category: string;
  name: string;
  account_details: string | null;
  username: string | null;
  password: string | null;
  backup_code: string | null;
  
  capital_price: number;
  post_price: number;
  promo_price: number | null;
  current_price: number;
  
  status: StockStatus;
  purchase_payment_status: PurchasePaymentStatus;
  payment_account_id: string | null;
  
  purchase_date: string | null;
  post_date: string | null;
  booking_date: string | null;
  sold_date: string | null;
  
  seller_info: string | null;
  buyer_info: string | null;
  internal_notes: string | null;
  
  images: string[];
  
  admin_id: string | null;
  
  created_at: string;
  updated_at: string;
}

export interface Deal {
  id: string; // UUID
  deal_number: string;
  customer_name: string;
  customer_contact: string | null;
  
  stock_id: string;
  
  deal_price: number;
  total_paid: number;
  remaining_balance: number;
  payment_percentage: number;
  
  status: DealStatus;
  due_date: string | null;
  notes: string | null;
  
  admin_id: string | null;
  
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string; // UUID
  deal_id: string;
  account_id: string;
  
  amount: number;
  payment_type: PaymentType;
  status: PaymentStatus;
  
  proof_url: string | null;
  notes: string | null;
  
  admin_id: string | null;
  
  created_at: string;
  updated_at: string;
}

export interface FinanceLedger {
  id: string; // UUID
  account_id: string;
  
  transaction_type: LedgerTransactionType;
  amount: number; // Positive for IN, Negative for OUT
  
  deal_id: string | null;
  payment_id: string | null;
  stock_id: string | null;
  
  description: string | null;
  admin_id: string | null;
  
  created_at: string;
}

export interface AuditLog {
  id: string; // UUID
  user_id: string | null;
  role_name: string | null;
  action: string;
  module: string;
  
  old_data: Record<string, any> | null;
  new_data: Record<string, any> | null;
  
  related_id: string | null;
  description: string | null;
  ip_address: string | null;
  
  created_at: string;
}

// ============================================================================
// RELATIONAL TYPES (Helpful for Supabase Joins)
// ============================================================================

export interface DealWithRelations extends Deal {
  stock?: Stock;
  payments?: Payment[];
  admin?: PublicUser;
}

export interface PaymentWithRelations extends Payment {
  deal?: Deal;
  account?: Account;
  admin?: PublicUser;
}

export interface LedgerWithRelations extends FinanceLedger {
  account?: Account;
  deal?: Deal;
  payment?: Payment;
  stock?: Stock;
  admin?: PublicUser;
}
