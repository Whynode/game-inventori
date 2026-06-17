-- Migration: Add atomic process_payment RPC to safely handle split payments and ledger updates

CREATE OR REPLACE FUNCTION process_payment(
  p_deal_id UUID,
  p_account_id UUID,
  p_amount NUMERIC,
  p_notes TEXT,
  p_admin_id UUID
) RETURNS void AS $$
DECLARE
  v_deal deals%ROWTYPE;
  v_payment_id UUID;
  v_new_total NUMERIC;
  v_new_percentage NUMERIC;
  v_new_deal_status deal_status;
  v_new_stock_status stock_status;
BEGIN
  -- 1. Lock the deal row to prevent concurrent race conditions
  SELECT * INTO v_deal FROM deals WHERE id = p_deal_id FOR UPDATE;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Deal not found';
  END IF;

  -- 2. Insert Payment
  INSERT INTO payments (deal_id, account_id, amount, payment_type, status, notes, admin_id)
  VALUES (p_deal_id, p_account_id, p_amount, 'IN', 'COMPLETED', p_notes, p_admin_id)
  RETURNING id INTO v_payment_id;

  -- 3. Insert Finance Ledger (Double-entry principle)
  INSERT INTO finance_ledger (account_id, transaction_type, amount, deal_id, payment_id, stock_id, description, admin_id)
  VALUES (p_account_id, 'PAYMENT_IN', p_amount, p_deal_id, v_payment_id, v_deal.stock_id, p_notes, p_admin_id);

  -- 4. Update Target Account Balance
  UPDATE accounts SET balance = balance + p_amount WHERE id = p_account_id;

  -- 5. Calculate new financial state of the Deal
  v_new_total := v_deal.total_paid + p_amount;
  
  -- Prevent division by zero just in case
  IF v_deal.deal_price > 0 THEN
    v_new_percentage := (v_new_total / v_deal.deal_price) * 100;
  ELSE
    v_new_percentage := 100;
  END IF;
  
  -- Determine new statuses based on PRD business rules
  IF v_new_percentage >= 100 THEN
    v_new_deal_status := 'PAID';
    v_new_stock_status := 'SOLD';
  ELSIF v_new_percentage >= 70 THEN
    v_new_deal_status := 'LIMITED_ACCESS';
    v_new_stock_status := 'LIMITED_ACCESS';
  ELSIF v_new_percentage >= 20 THEN
    v_new_deal_status := 'BOOKED';
    v_new_stock_status := 'BOOKED';
  ELSE
    -- If under 20%, it remains in Draft, stock remains available until DP threshold met
    v_new_deal_status := 'DRAFT'; 
    v_new_stock_status := 'AVAILABLE';
  END IF;

  -- 6. Update Deal Record
  UPDATE deals 
  SET total_paid = v_new_total,
      remaining_balance = deal_price - v_new_total,
      payment_percentage = v_new_percentage,
      status = v_new_deal_status,
      updated_at = NOW()
  WHERE id = p_deal_id;

  -- 7. Update Stock Record
  UPDATE stocks 
  SET status = v_new_stock_status,
      updated_at = NOW(),
      sold_date = CASE WHEN v_new_stock_status = 'SOLD' AND sold_date IS NULL THEN NOW() ELSE sold_date END,
      booking_date = CASE WHEN v_new_stock_status IN ('BOOKED', 'LIMITED_ACCESS', 'SOLD') AND booking_date IS NULL THEN NOW() ELSE booking_date END
  WHERE id = v_deal.stock_id;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
