-- =====================================================================================
-- 1. ENUMS
-- =====================================================================================

CREATE TYPE user_role AS ENUM ('OWNER', 'ADMIN', 'VIEWER');
CREATE TYPE stock_status AS ENUM ('AVAILABLE', 'BOOKED', 'LIMITED_ACCESS', 'SOLD', 'ON_HOLD', 'PROBLEM_ACTION', 'PROBLEM_PERMANENT', 'CANCELLED');
CREATE TYPE deal_status AS ENUM ('DRAFT', 'BOOKED', 'LIMITED_ACCESS', 'PAID', 'CANCELLED_BY_BUYER', 'CANCELLED_BY_SELLER', 'REFUND_PARTIAL', 'REFUND_FULL', 'PROBLEM', 'COMPLETED');
CREATE TYPE payment_status AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');
CREATE TYPE payment_type AS ENUM ('IN', 'OUT');
CREATE TYPE ledger_transaction_type AS ENUM ('PAYMENT_IN', 'PAYMENT_OUT', 'REFUND', 'CASHBACK', 'TRANSFER_IN', 'TRANSFER_OUT', 'STOCK_PURCHASE', 'ADJUSTMENT');

-- =====================================================================================
-- 2. USERS & ROLES
-- =====================================================================================

CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    permissions JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Extends Supabase auth.users
CREATE TABLE public_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    role_id UUID REFERENCES roles(id) ON DELETE SET NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================================================
-- 3. ACCOUNTS (REKENING)
-- =====================================================================================

CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    account_number VARCHAR(255),
    balance NUMERIC(15, 2) NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================================================
-- 4. STOCKS
-- =====================================================================================

CREATE TABLE stocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    account_details TEXT,
    username VARCHAR(255),
    password VARCHAR(255),
    backup_code VARCHAR(255),
    
    capital_price NUMERIC(15, 2) NOT NULL DEFAULT 0,
    post_price NUMERIC(15, 2) NOT NULL DEFAULT 0,
    promo_price NUMERIC(15, 2),
    current_price NUMERIC(15, 2) NOT NULL DEFAULT 0,
    
    status stock_status NOT NULL DEFAULT 'AVAILABLE',
    
    purchase_date TIMESTAMPTZ,
    post_date TIMESTAMPTZ,
    booking_date TIMESTAMPTZ,
    sold_date TIMESTAMPTZ,
    
    seller_info TEXT,
    buyer_info TEXT,
    internal_notes TEXT,
    
    admin_id UUID REFERENCES public_users(id) ON DELETE SET NULL,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================================================
-- 5. DEALS (TRANSAKSI PENJUALAN)
-- =====================================================================================

CREATE TABLE deals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_number VARCHAR(100) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_contact VARCHAR(255),
    
    stock_id UUID REFERENCES stocks(id) ON DELETE RESTRICT,
    
    deal_price NUMERIC(15, 2) NOT NULL,
    total_paid NUMERIC(15, 2) NOT NULL DEFAULT 0,
    remaining_balance NUMERIC(15, 2) NOT NULL,
    payment_percentage NUMERIC(5, 2) NOT NULL DEFAULT 0,
    
    status deal_status NOT NULL DEFAULT 'DRAFT',
    
    due_date TIMESTAMPTZ,
    notes TEXT,
    
    admin_id UUID REFERENCES public_users(id) ON DELETE SET NULL,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================================================
-- 6. PAYMENTS
-- =====================================================================================

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_id UUID REFERENCES deals(id) ON DELETE CASCADE,
    account_id UUID REFERENCES accounts(id) ON DELETE RESTRICT,
    
    amount NUMERIC(15, 2) NOT NULL,
    payment_type payment_type NOT NULL DEFAULT 'IN',
    status payment_status NOT NULL DEFAULT 'PENDING',
    
    proof_url VARCHAR(1024),
    notes TEXT,
    
    admin_id UUID REFERENCES public_users(id) ON DELETE SET NULL,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================================================
-- 7. FINANCE LEDGER
-- =====================================================================================

CREATE TABLE finance_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID REFERENCES accounts(id) ON DELETE RESTRICT,
    
    transaction_type ledger_transaction_type NOT NULL,
    amount NUMERIC(15, 2) NOT NULL,
    
    deal_id UUID REFERENCES deals(id) ON DELETE SET NULL,
    payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
    stock_id UUID REFERENCES stocks(id) ON DELETE SET NULL,
    
    description TEXT,
    admin_id UUID REFERENCES public_users(id) ON DELETE SET NULL,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================================================
-- 8. AUDIT LOGS
-- =====================================================================================

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public_users(id) ON DELETE SET NULL,
    role_name VARCHAR(100),
    action VARCHAR(100) NOT NULL,
    module VARCHAR(100) NOT NULL,
    
    old_data JSONB,
    new_data JSONB,
    
    related_id UUID,
    description TEXT,
    ip_address VARCHAR(45),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
