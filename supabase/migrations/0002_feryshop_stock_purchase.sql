-- Migration: Add Purchase Tracking and RPC

CREATE TYPE purchase_payment_status AS ENUM ('LUNAS', 'PENDING');

ALTER TABLE stocks 
ADD COLUMN purchase_payment_status purchase_payment_status DEFAULT 'LUNAS',
ADD COLUMN payment_account_id UUID REFERENCES accounts(id) ON DELETE SET NULL;

CREATE OR REPLACE FUNCTION process_stock_purchase(
  p_category VARCHAR,
  p_name VARCHAR,
  p_account_details TEXT,
  p_username VARCHAR,
  p_password VARCHAR,
  p_capital_price NUMERIC,
  p_post_price NUMERIC,
  p_current_price NUMERIC,
  p_seller_info TEXT,
  p_internal_notes TEXT,
  p_purchase_payment_status purchase_payment_status,
  p_payment_account_id UUID,
  p_admin_id UUID
) RETURNS UUID AS $$
DECLARE
  v_stock_id UUID;
BEGIN
  -- 1. Insert into stocks
  INSERT INTO stocks (
    category, name, account_details, username, password,
    capital_price, post_price, current_price, status, purchase_date,
    seller_info, internal_notes, admin_id, purchase_payment_status, payment_account_id
  ) VALUES (
    p_category, p_name, p_account_details, p_username, p_password,
    p_capital_price, p_post_price, p_current_price, 'AVAILABLE', NOW(),
    p_seller_info, p_internal_notes, p_admin_id, p_purchase_payment_status, p_payment_account_id
  ) RETURNING id INTO v_stock_id;

  -- 2. If LUNAS, handle finance ledger and account balance
  IF p_purchase_payment_status = 'LUNAS' THEN
    IF p_payment_account_id IS NULL THEN
      RAISE EXCEPTION 'payment_account_id is required when status is LUNAS';
    END IF;

    -- Insert Finance Ledger (OUT)
    INSERT INTO finance_ledger (
      account_id, transaction_type, amount, stock_id, description, admin_id
    ) VALUES (
      p_payment_account_id, 'STOCK_PURCHASE', -p_capital_price, v_stock_id, 'Pembelian Stok Lunas', p_admin_id
    );

    -- Deduct Account Balance
    UPDATE accounts 
    SET balance = balance - p_capital_price 
    WHERE id = p_payment_account_id;
  END IF;

  RETURN v_stock_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
