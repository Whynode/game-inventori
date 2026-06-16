# PRD: Core Features & Modules

## 1. Authentication Module
- **Login Page:** A clean, minimal login screen centered on the page using the soft mesh background defined in `3_design.md`. 
  - *Fields:* Email, Password.
  - *Feedback:* Use toast notifications for invalid credentials.
- **Session Management:** Securely handle Supabase sessions. Protect all `/dashboard` routes using Next.js Middleware to redirect unauthenticated users back to `/login`.

## 2. Dashboard / Overview Module
The main landing page after login. The UI MUST conditionally render based on the user's role (`SUPER_ADMIN` vs `ADMIN`).

### A. Super Admin View (Financial Focus)
- **Top Metric Cards:** - Total Revenue (from `SOLD` items).
  - Total Net Profit (Sold Price - Capital Price).
  - Active Capital (Sum of `capital_price` for `UNPOSTED` and `AVAILABLE` items).
- **Activity Chart:** A minimal line or bar chart (using `recharts` or Shadcn charts) showing sales revenue over the last 30 days.

### B. Admin View (Operational Focus)
- **Top Metric Cards:**
  - Tasks Pending: Count of `UNPOSTED` accounts.
  - Active Stock: Count of `AVAILABLE` accounts.
  - Completed: Count of `SOLD` accounts this week.
- *Strict Rule:* The Admin view MUST NOT render any financial metrics, profit margins, or capital data.

## 3. Inventory Management Module (The Core)
A comprehensive Data Table page to manage all game accounts.
- **Data Table Features:** - Search by internal reference code.
  - Filter by Game (ML, FF, etc.).
  - Filter by Status (Unposted, Available, Sold).
  - Pagination.
- **Add New Item (Slide-out / Sheet or Dialog):**
  - Select Game Category.
  - Upload Screenshot (Client-side preview -> Uploads to Supabase Storage -> Returns URL).
  - Input fields: Internal Reference, Account Specs (Textarea), Capital Price, Asking Price.
- **Item Action Menu (Row level):**
  - View Details / Edit.
  - Generate Caption (Opens Caption Module).
  - Mark as Sold (Opens a modal to input the final `sold_price`).
  - Delete (Super Admin only).

## 4. Auto-Caption Generator Module
This is a critical workflow feature for the staff to accelerate marketing.
- **Trigger:** Clicking "Generate Caption" on an `UNPOSTED` or `AVAILABLE` inventory item.
- **UI:** A modal or slide-over sheet containing a formatted text block.
- **Logic:** The system takes the `account_specs`, `asking_price`, and Game Category, and formats it into a social-media-ready template (with appropriate emojis).
- **Action:** A prominent "Copy to Clipboard" button. Once copied, the system should prompt the user: "Update status to AVAILABLE?" to automatically change the status from `UNPOSTED`.

## 5. Game Category Management (Settings)
- A simple settings page restricted to `SUPER_ADMIN`.
- Allows adding new games (e.g., adding "PUBG Mobile") to populate the dropdown menus in the Inventory forms.

## 6. Reports & Export (Super Admin Only)
- A dedicated page or a button on the Dashboard to export data.
- **Functionality:** Export filtered inventory or sales data into a `.csv` or `.xlsx` format for external accounting purposes.