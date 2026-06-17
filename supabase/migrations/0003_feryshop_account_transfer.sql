-- Migration: Add atomic process_account_transfer RPC to safely handle inter-account transfers and double-entry ledger logging.

CREATE OR REPLACE FUNCTION process_account_transfer(
  p_source_account_id UUID,
  p_dest_account_id UUID,
  p_amount NUMERIC,
  p_admin_fee NUMERIC,
  p_admin_id UUID
) RETURNS void AS $$
DECLARE
  v_source_name VARCHAR(255);
  v_dest_name VARCHAR(255);
  v_source_balance NUMERIC;
BEGIN
  -- 1. Ensure source and destination are not the same
  IF p_source_account_id = p_dest_account_id THEN
    RAISE EXCEPTION 'Source and destination accounts must be different';
  END IF;

  -- 2. Ensure amount is positive
  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'Transfer amount must be greater than zero';
  END IF;

  -- 3. Ensure admin fee is non-negative
  IF p_admin_fee < 0 THEN
    RAISE EXCEPTION 'Admin fee cannot be negative';
  END IF;

  -- 4. Lock source and destination accounts to prevent race conditions and deadlocks
  -- Lock in a consistent alphabetical order of UUIDs
  IF p_source_account_id < p_dest_account_id THEN
    SELECT name, balance INTO v_source_name, v_source_balance FROM accounts WHERE id = p_source_account_id FOR UPDATE;
    SELECT name INTO v_dest_name FROM accounts WHERE id = p_dest_account_id FOR UPDATE;
  ELSE
    SELECT name INTO v_dest_name FROM accounts WHERE id = p_dest_account_id FOR UPDATE;
    SELECT name, balance INTO v_source_name, v_source_balance FROM accounts WHERE id = p_source_account_id FOR UPDATE;
  END IF;

  -- 5. Validate source account exists
  IF v_source_name IS NULL THEN
    RAISE EXCEPTION 'Source account not found';
  END IF;

  -- 6. Validate destination account exists
  IF v_dest_name IS NULL THEN
    RAISE EXCEPTION 'Destination account not found';
  END IF;

  -- 7. Validate sufficient funds
  IF v_source_balance < (p_amount + p_admin_fee) THEN
    RAISE EXCEPTION 'Saldo tidak mencukupi untuk melakukan transfer (Saldo: Rp %, Butuh: Rp %)', 
      v_source_balance, (p_amount + p_admin_fee);
  END IF;

  -- 8. Deduct amount + admin_fee from Source Account
  UPDATE accounts 
  SET balance = balance - (p_amount + p_admin_fee),
      updated_at = NOW()
  WHERE id = p_source_account_id;

  -- 9. Add amount to Destination Account
  UPDATE accounts 
  SET balance = balance + p_amount,
      updated_at = NOW()
  WHERE id = p_dest_account_id;

  -- 10. Insert OUT record in finance_ledger for the source account (the transferred amount)
  INSERT INTO finance_ledger (account_id, transaction_type, amount, description, admin_id, created_at)
  VALUES (p_source_account_id, 'TRANSFER_OUT', -p_amount, 'Mutasi Saldo ke ' || v_dest_name, p_admin_id, NOW());

  -- 11. Insert IN record in finance_ledger for the destination account (the transferred amount)
  INSERT INTO finance_ledger (account_id, transaction_type, amount, description, admin_id, created_at)
  VALUES (p_dest_account_id, 'TRANSFER_IN', p_amount, 'Mutasi Saldo dari ' || v_source_name, p_admin_id, NOW());

  -- 12. If admin_fee > 0, insert an additional OUT record in finance_ledger for the source account
  IF p_admin_fee > 0 THEN
    INSERT INTO finance_ledger (account_id, transaction_type, amount, description, admin_id, created_at)
    VALUES (p_source_account_id, 'TRANSFER_OUT', -p_admin_fee, 'Biaya Admin Mutasi', p_admin_id, NOW());
  END IF;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
