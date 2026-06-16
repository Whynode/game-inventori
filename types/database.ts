export type UserRole = 'SUPER_ADMIN' | 'ADMIN';

export type InventoryStatus = 'UNPOSTED' | 'AVAILABLE' | 'SOLD';

export interface Profile {
  id: string; // UUID references auth.users(id)
  full_name: string;
  role: UserRole;
  created_at: string;
}

export interface Game {
  id: string; // UUID
  name: string;
  slug: string;
  created_at: string;
}

export interface InventoryItem {
  id: string; // UUID
  game_id: string; // UUID references games(id)
  added_by: string; // UUID references profiles(id)
  title_reference: string;
  account_specs: string;
  screenshot_url: string;
  capital_price: number;
  asking_price: number;
  sold_price: number | null;
  status: InventoryStatus;
  sold_at: string | null;
  created_at: string;
  updated_at: string;
}
