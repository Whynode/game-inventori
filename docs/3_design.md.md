# PRD: UI/UX & Design System

## 1. Design Philosophy
The application must embody a "Human-Made Modern B2B SaaS" aesthetic. This means avoiding symmetrical, boxy, and rigid AI-generated templates. The UI must feel breathable, premium, and calm, designed specifically to reduce eye strain for admins who will stare at the dashboard for hours.

## 2. Color Palette (Strictly Enforced)
Do NOT use default Tailwind colors blindly. Adhere to this specific hierarchy:

- **App Background:** `bg-slate-50` (`#F8FAFC`). This is the canvas for the entire application.
- **Card/Container Background:** Pure `bg-white` (`#FFFFFF`).
- **Primary Brand (Calm Blue):** - Base: `bg-blue-600` (`#2563EB`)
  - Hover/Interaction: `bg-blue-700` (`#1D4ED8`)
  - Subtle Highlight (for active menus/selected items): `bg-blue-50` (`#EFF6FF`) with `text-blue-600`.
  - *Strict Rule:* NO neon, fluorescent, or cyan tones. 
- **Typography Colors:**
  - Headings & Primary Text: `text-slate-900` (`#0F172A`)
  - Secondary Text & Descriptions: `text-slate-500` (`#64748B`)
  - Placeholder Text: `text-slate-400` (`#94A3B8`)
- **Status/Feedback Colors (Muted & Soft):**
  - Success (Available/Sold): `bg-emerald-50 text-emerald-600 ring-emerald-200`
  - Warning (Pending/Old Stock): `bg-amber-50 text-amber-600 ring-amber-200`
  - Danger (Error/Delete): `bg-rose-50 text-rose-600 ring-rose-200`

## 3. Custom UI Elements (Tailwind Overrides)

### A. Soft Gradients (For Hero/Top-Level Sections)
To achieve the premium look from the references, use subtle mesh-like gradients exclusively for top-level headers or login screens.
- *Utility:* `bg-gradient-to-b from-blue-50/80 via-slate-50 to-slate-50`

### B. Custom Soft Shadows (Floating Effect)
NEVER use default `shadow-md` or `shadow-lg` on main cards, as they are too harsh. Use these custom arbitrary values:
- *Main Cards:* `shadow-[0_4px_20px_-4px_rgba(15,23,42,0.04)]`
- *Hover Cards/Modals:* `shadow-[0_8px_30px_-6px_rgba(15,23,42,0.08)]`
- *Buttons/Interactive Elements:* `shadow-[0_2px_10px_-3px_rgba(37,99,235,0.2)]` (Subtle blue glow).

### C. Border Radius
- Main layout containers, graphs, and large cards: `rounded-xl` (12px) or `rounded-2xl` (16px).
- Buttons, input fields, and small badges: `rounded-lg` (8px).
- *Strict Prohibition:* Do NOT use `rounded-full` for standard buttons, cards, or inputs. It looks cheap. Reserve `rounded-full` ONLY for Avatar images or notification dots.

### D. Typography & Spacing
- **Font:** Inter, Plus Jakarta Sans, or standard sans-serif optimized for legibility.
- **Headings:** Use tight tracking (e.g., `tracking-tight`) for an elegant look.
- **Whitespace:** Use generous, asymmetrical padding. For example, a card should have `p-6 md:p-8`. Do not cramp data tables. Provide `gap-6` or `gap-8` between major grid items.

## 4. Iconography Implementation
- **Navigation & Basic Actions:** Use `lucide-react`. 
  - *Specs:* `size={20}`, `strokeWidth={1.5}`. Keep it thin and elegant.
- **Dashboard Stats & Empty States:** Use `@phosphor-icons/react`.
  - *Specs:* Use the `weight="duotone"` variant exclusively to add a layered, premium look without adding clutter.