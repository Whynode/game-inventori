# PRD: User Workflows & Application Logic

## 1. Workflow Philosophy
The application must feel fluid. Actions should not require unnecessary page reloads. Use optimistic UI updates where appropriate (e.g., updating a status badge immediately while the server action processes in the background).

## 2. Core Operational Workflows

### Workflow A: New Inventory Ingestion (Stok Masuk)
*Triggered when the business acquires a new game account.*
1. User (Admin/Super Admin) logs in and navigates to the "Inventory" page.
2. Clicks the "Add New Account" button. A slide-out panel (Sheet) opens.
3. User uploads the screenshot image first. (UI shows uploading spinner).
4. User fills in the Game Category, Reference Code, Specs, Capital Price, and Asking Price.
5. User clicks "Save".
6. **System Action:** Validates data, inserts into Supabase `inventory` table, and sets initial status to `UNPOSTED`. The panel closes, and the table updates to show the new item.

### Workflow B: Marketing & Caption Generation
*Triggered when staff is ready to post the account to social media.*
1. Admin filters the Inventory table to show `UNPOSTED` status.
2. Admin clicks the "Generate Caption" icon on a specific row.
3. A modal opens displaying the auto-generated text based on the account's details.
4. Admin clicks "Copy to Clipboard".
5. **Crucial UX Step:** Upon successful copy, the system shows a prompt: *"Caption copied! Do you want to mark this account as AVAILABLE?"*
6. If Admin clicks "Yes", the system executes a Server Action to update the item's status from `UNPOSTED` to `AVAILABLE`. The modal closes and the table updates.

### Workflow C: Sales Execution (Pencatatan Terjual)
*Triggered when a buyer has successfully transferred money.*
1. Admin locates the `AVAILABLE` account in the table.
2. Admin clicks the "Mark as Sold" action.
3. A confirmation modal appears, requiring the Admin to input the exact `sold_price` (as the final agreed price might differ from the initial `asking_price`).
4. Admin submits the form.
5. **System Action:** Validates input, updates the inventory record status to `SOLD`, logs the `sold_price`, and records the `sold_at` timestamp.

### Workflow D: Managerial Review (Financial Audit)
*Triggered when the Business Owner checks performance.*
1. Super Admin logs in and lands on the Dashboard.
2. The Dashboard strictly queries the `inventory` table for items where status is `SOLD`.
3. **Calculation Logic:** It calculates the Net Profit dynamically: `SUM(sold_price) - SUM(capital_price)` for all sold items within the selected timeframe.
4. The charts render this data to show business health.