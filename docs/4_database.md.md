# PRD: Database Schema & Supabase Architecture

## 1. Database Philosophy
This system uses Supabase (PostgreSQL) as the primary data store. The database design must strictly adhere to relational principles, ensuring data integrity through foreign keys and constraints.

## 2. Authentication & Role Management (RBAC)
We rely on Supabase Auth for authentication. However, to manage internal roles (Super Admin vs. Admin), we will create a dedicated `profiles` or `users_roles` table that links to the Supabase `auth.users` table via a trigger.

### Enum: `user_role`
- `SUPER_ADMIN`: Full access, including financial data.
- `ADMIN`: Operational access only.

### Table: `profiles`
- `id` (uuid, Primary Key, References `auth.users(id)`)
- `full_name` (text, not null)
- `role` (enum `user_role`, default: 'ADMIN')
- `created_at` (timestamp, default: now())

## 3. Core Tables

### Table: `games` (Lookup Table)
Stores the categories of games being managed (e.g., Mobile Legends, Free Fire).
- `id` (uuid, Primary Key, default: uuid_generate_v4())
- `name` (text, not null, unique) - e.g., "Mobile Legends"
- `slug` (text, not null, unique) - e.g., "mobile-legends"
- `created_at` (timestamp, default: now())

### Enum: `inventory_status`
- `UNPOSTED`: Freshly inputted, caption not yet generated/posted to socials.
- `AVAILABLE`: Posted and waiting for buyers.
- `SOLD`: Transaction completed.

### Table: `inventory` (The Core Entity)
Stores the actual game accounts.
- `id` (uuid, Primary Key, default: uuid_generate_v4())
- `game_id` (uuid, Foreign Key references `games(id)`, not null)
- `added_by` (uuid, Foreign Key references `profiles(id)`)
- `title_reference` (text) - Internal name/code for the account (e.g., "ML-Mythic-001")
- `account_specs` (jsonb or text) - Details like rank, skins, win rate, etc.
- `screenshot_url` (text) - Path to the image in Supabase Storage.
- `capital_price` (integer, not null) - The cost to buy the account (Modal).
- `asking_price` (integer, not null) - The initial selling price offered to buyers.
- `sold_price` (integer, nullable) - The final agreed price when sold.
- `status` (enum `inventory_status`, default: 'UNPOSTED')
- `sold_at` (timestamp, nullable)
- `created_at` (timestamp, default: now())
- `updated_at` (timestamp, default: now())

## 4. Supabase Storage (Buckets)
- **Bucket Name:** `account-screenshots`
- **Access:** Public read access (for rendering in the dashboard). Upload access restricted to authenticated users (Super Admin & Admin).

## 5. Row Level Security (RLS) Rules (Guidelines for AI)
The AI must ensure that RLS policies are considered in the SQL migration scripts:
- All tables must have RLS enabled.
- `profiles`: Users can read all profiles but only Super Admins can update roles.
- `games`: All authenticated users can read. Only Super Admins can insert/update/delete.
- `inventory`: All authenticated users can read, insert, and update. Deletion is restricted to Super Admins.
- Financial data isolation: On the frontend/server actions, `capital_price` and `sold_price` must be stripped from API payloads if the requesting user's role is `ADMIN`, ensuring they cannot calculate profit margins.