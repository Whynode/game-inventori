# PRD: Project Overview & Scope

## 1. Executive Summary
**Project Name:** Game Account Inventory & Sales Management Dashboard  
**Application Type:** Internal B2B Back-Office Web Application  

This project is a dedicated internal management system designed for a digital asset trading business specializing in video game accounts (primarily Mobile Legends and Free Fire). The system serves as a central hub to manage inventory lifecycle, streamline social media marketing operations via automated caption generation, and track financial performance. It completely replaces manual spreadsheet tracking.

## 2. Core Objectives
- **Inventory Centralization:** Provide a single source of truth for all purchased game accounts, tracking their specifications, purchase costs, and current status.
- **Operational Automation:** Eliminate manual copywriting by automatically generating formatted promotional captions based on account specifications, ready for copy-pasting to WhatsApp/Instagram.
- **Financial Visibility:** Track profitability automatically by calculating the difference between acquisition cost and final selling price.

## 3. Target Users & Role-Based Access Control (RBAC)
The application is strictly for internal staff. There is no public registration or customer-facing storefront.

### Role A: Super Admin (Business Owner)
- **Permissions:** Unrestricted access.
- **Capabilities:**
  - View comprehensive financial dashboards (total revenue, net profit, capital tied up in inventory).
  - Add, edit, or remove game categories (e.g., adding a new game besides ML and FF).
  - Manage staff accounts.
  - Export financial and inventory reports (Excel/PDF).

### Role B: Admin / Warehouse Staff (Employee)
- **Permissions:** Operational access only. Blind to overall financial health and net profit margins.
- **Capabilities:**
  - Input new inventory (upload screenshots, input account specs, set base selling price).
  - Filter inventory by status (e.g., "Unposted", "Available", "Sold").
  - Generate promotional captions.
  - Update account status to "Sold" and log the final transaction amount.

## 4. System Boundaries & Out-of-Scope (CRITICAL FOR AI)
To prevent feature creep, the AI must strictly adhere to the following exclusions:
- **NO Public E-Commerce:** Do not build a storefront, shopping cart, or customer checkout flow.
- **NO Payment Gateways:** Do not integrate Stripe, PayPal, Midtrans, etc. Payments are settled externally (via direct bank transfer or e-wallet communicated through WhatsApp). The system only *logs* the transaction data manually inputted by the Admin.
- **NO Customer Accounts:** Buyers cannot log in to this system.
- **NO Real-Time Game API Integration:** The system does not connect to Moonton or Garena servers to fetch account data. All data is manually inputted based on screenshots and staff assessment.

## 5. Primary Data Entities
At a high level, the system revolves around:
- **Games:** The platform categorization (Mobile Legends, Free Fire, etc.).
- **Inventory Items (Accounts):** The specific digital asset, containing specs (rank, skins, win rate), pricing (capital, asking price), media (screenshots), and status.
- **Transactions:** The record of a sale, tying an inventory item to a final selling price and date.