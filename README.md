# Beitna Manager

A premium, private, mobile-first family home management web app built for one specific family.

> **Beitna** (بيتنا) means "Our Home" in Arabic.

## What is this?

Beitna Manager is a **single-family home management app** — not a SaaS, not multi-tenant, no sign-ups, no invites. It opens directly to a beautiful profile selection screen with 4 fixed family members:

- **Moustafa** (Pappy) — Father
- **Doaa** (Mamy) — Mother
- **Ahmed** — Son
- **Sherien** — Daughter

Each member gets their own personalized dashboard experience.

## Features

### Core Sections
- **Profile Selection** — Beautiful landing screen with family photos and role cards
- **Personal Dashboard** — Welcome message, today's summary, my responsibilities, quick actions, recent activity
- **Money & Expenses** — Track spending by category, filter by person/month, add/edit/delete expenses
- **Bills** — Upcoming, overdue, paid bills with mark-as-paid flow
- **Tasks** — Assign tasks to family members, priority levels, due dates, mark as done
- **Repairs & Maintenance** — Track broken items, technician contacts, status flow, photos, costs
- **Shopping List** — Organized by category, assign buyers, mark as bought, convert to expense
- **Home Items** — Appliance inventory, warranty tracking, repair history per item
- **Reports** — Monthly spending, category breakdown, who paid what, home insights
- **Family Profiles** — View all members with their activity summary
- **Settings** — Switch profile, clear data, app info

### Design Philosophy
- **Premium & Calm** — Not a corporate dashboard, not a school project
- **Mobile-first** — Designed for 375px–430px phone screens, works beautifully on desktop too
- **Warm colors** — Linen background (#F7F3EA), olive primary (#465431), champagne accent (#D8B86F)
- **No fake data** — Clean empty states, no placeholders
- **Family-focused** — Personalized greetings, role labels, warm language

## Tech Stack

- **Next.js 16** — App Router, React 19
- **TypeScript** — Full type safety
- **Tailwind CSS v4** — Custom color palette with CSS variables
- **Lucide React** — Clean, minimal icons
- **Local Storage** — Data persists in browser (ready for Supabase migration)
- **No authentication** — Profile selection acts as the access gate

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

The app will be available at `http://localhost:3000`.

## Data Storage

Currently uses browser `localStorage` for all data. This means:
- ✅ Data persists across browser sessions
- ✅ No server required, works offline
- ✅ Instant response, no loading states
- ⚠️ Data is per-browser (not shared across devices)
- ⚠️ Clearing browser data will erase everything

### Supabase Migration (Ready)

A full database schema is included in `supabase/schema.sql`. When you're ready to migrate to a real database:

1. Create a Supabase project
2. Run the SQL in `supabase/schema.sql`
3. Replace the `localStorage` data store with Supabase client calls
4. The schema includes RLS policies set to allow-all for this single-family use case

## Project Structure

```
app/
  lib/
    types.ts          # TypeScript interfaces
    constants.ts      # Profiles, categories, helpers, formatters
  context/
    ProfileContext.tsx # Selected profile state + localStorage persistence
  hooks/
    useDataStore.ts    # CRUD operations for all entities + activity log
  components/
    Header.tsx         # Sticky page header with back button
    BottomNav.tsx      # Mobile bottom navigation
    Modal.tsx          # Bottom sheet / centered modal
    EmptyState.tsx     # Empty state illustrations
    FilterBar.tsx      # Horizontal scrollable filter tabs
    SummaryCard.tsx    # Dashboard metric cards
    QuickActionButton.tsx # Dashboard quick action buttons
    ActivityItem.tsx   # Activity log entry component
  page.tsx             # Profile selection screen (landing)
  dashboard/
    page.tsx           # Personal dashboard
  money/
    page.tsx           # Expenses + category breakdown
  bills/
    page.tsx           # Bills tracking + mark as paid
  tasks/
    page.tsx           # Task management
  repairs/
    page.tsx           # Repair tracking
  shopping/
    page.tsx           # Shopping list
  items/
    page.tsx           # Home inventory
  reports/
    page.tsx           # Monthly reports + insights
  family/
    page.tsx           # Family members + more links
  settings/
    page.tsx           # App settings
  globals.css          # Tailwind theme + custom colors + animations
  layout.tsx           # Root layout with Inter font + ProfileProvider
supabase/
  schema.sql           # Full database schema ready for Supabase
```

## Customization

### Family Members
Edit `app/lib/constants.ts` — change the `PROFILES` array to update names, nicknames, roles, and colors.

### Expense Categories
Edit `EXPENSE_CATEGORIES` in `app/lib/constants.ts` to add/remove categories.

### Colors
The Tailwind v4 theme is defined in `app/globals.css` with CSS custom properties. All pages use these semantic color names.

## License

Private family project — not open source.

---

Built with love for Beitna. 🏠
