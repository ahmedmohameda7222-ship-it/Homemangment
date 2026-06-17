# Beitna Manager - Agent Specification

## Project Context
- Next.js 16 + TypeScript + Tailwind CSS v4 + React 19
- Local data storage via `useDataStore` hook (localStorage, ready for Supabase migration)
- Profile-based app (no auth) - 4 fixed family members: Moustafa, Doaa, Ahmed, Sherien
- Mobile-first, premium, calm, warm aesthetic
- All pages use bottom navigation (BottomNav component) when profile is selected

## Color Palette (Tailwind v4 @theme)
- `--color-olive`: #465431 (primary)
- `--color-olive-light`: #5a6b42
- `--color-olive-dark`: #354025
- `--color-champagne`: #D8B86F (accent)
- `--color-linen`: #F7F3EA (background)
- `--color-cream`: #FFFCF7 (card background)
- `--color-cream-dark`: #F5F0E8
- `--color-navy`: #1A1A2E (text)
- `--color-navy-muted`: #6B6B80
- `--color-sage`: #8A9A6B
- `--color-sky`: #7BA4C4
- `--color-rose`: #C47B7B
- `--color-amber`: #C4A47B
- `--color-warm-gray`: #E8E2D8

## Key Types (from app/lib/types.ts)
- ProfileId: "moustafa" | "doaa" | "ahmed" | "sherien"
- Expense, Bill, Task, Repair, HomeItem, ShoppingItem, ActivityLog, PaymentSummary
- TaskPriority: "low" | "medium" | "high"
- TaskStatus: "pending" | "done" | "late"
- RepairStatus: "new" | "need-repair" | "technician-contacted" | "in-progress" | "fixed" | "paid" | "closed"
- ShoppingCategory: various food/household categories

## Key Constants (from app/lib/constants.ts)
- PROFILES: array of 4 Profile objects with colors, greetings, nicknames
- EXPENSE_CATEGORIES: array with name, icon, color
- SHOPPING_CATEGORIES: array with name, icon
- REPAIR_STATUS_LABELS, REPAIR_STATUS_COLORS, TASK_PRIORITY_COLORS, TASK_STATUS_LABELS
- BILL_REPEAT_LABELS, PAYMENT_METHODS, ROOMS, LOCATIONS
- formatCurrency, formatDate, formatShortDate, getToday, getDaysUntil, generateId, getCurrentMonth, getMonthLabel, isOverdue, isDueSoon, getProfileById, getCategoryById

## Data Store API (from app/hooks/useDataStore.ts)
Returns: { data, loaded, addExpense, updateExpense, deleteExpense, addBill, updateBill, deleteBill, payBill, addTask, updateTask, deleteTask, markTaskDone, addRepair, updateRepair, deleteRepair, addHomeItem, updateHomeItem, deleteHomeItem, addShoppingItem, updateShoppingItem, deleteShoppingItem, markShoppingBought, getMonthlyExpenses, getPersonExpenses, getPersonBills, getPersonRepairs, getPersonTasks, getPersonShopping, getPaymentSummary }

`data` contains: { expenses, bills, tasks, repairs, homeItems, shoppingItems, activityLog }

## Shared Components
- **BottomNav** (app/components/BottomNav.tsx): Fixed bottom nav with Home, Money, Tasks, Repairs, More. Auto-hidden if no profile selected. Uses pathname for active state.
- **Header** (app/components/Header.tsx): Sticky header with back button, title, subtitle, optional action. `showBack` defaults true.
- **EmptyState** (app/components/EmptyState.tsx): Takes icon (LucideIcon), title, description, optional action.
- **Modal** (app/components/Modal.tsx): Bottom sheet on mobile, centered modal on desktop. Takes isOpen, onClose, title, children, maxWidth.
- **FilterBar** (app/components/FilterBar.tsx): Horizontal scrollable filter buttons. Takes options[], value, onChange.
- **QuickActionButton** (app/components/QuickActionButton.tsx): Icon + label button for quick actions grid.
- **SummaryCard** (app/components/SummaryCard.tsx): Icon + title + value + subtitle card. Optional href or onClick.
- **ActivityItem** (app/components/ActivityItem.tsx): Shows activity log entry with emoji icon, profile color, description, timestamp.

## Profile Context
- `useProfile()` returns `{ selectedProfile, selectProfile, clearProfile }`
- If `selectedProfile` is null, redirect to `/`
- Profile is persisted in localStorage

## Design Rules
- ALL pages: `min-h-full bg-linen pb-24` (padding for bottom nav)
- Use `max-w-md mx-auto px-5` for content containers
- Cards: `bg-cream rounded-2xl border border-warm-gray/60`
- Buttons: `bg-olive text-cream rounded-xl` for primary, `bg-cream border border-warm-gray/60` for secondary
- Inputs: `bg-cream border border-warm-gray/60 rounded-xl px-4 py-3 text-navy`
- Section titles: `text-sm font-semibold text-navy uppercase tracking-wider mb-3`
- Mobile-first: forms should be fast and simple on mobile
- Empty states with EmptyState component
- No fake data - use empty states when data is empty
- Use Lucide icons only (import from "lucide-react")
- All page components must be "use client" since they use hooks
- Form modals should use the Modal component
- List items should have hover states and clear tap targets on mobile
- Use `animate-fade-in-up` and `stagger-children` classes from globals.css for animations
