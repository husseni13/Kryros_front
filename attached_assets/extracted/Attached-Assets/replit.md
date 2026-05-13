# Kryros Marketplace

A full-featured e-commerce marketplace app for African markets — featuring product browsing, cart, checkout, BNPL financing, flash sales, order tracking, and more.

## Run & Operate

- `pnpm --filter @workspace/kryros run dev` — run the frontend (assigned PORT)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Wouter + TailwindCSS v4
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/kryros/` — React frontend (all pages, components, styles)
- `artifacts/api-server/` — Express API server
- `artifacts/kryros/src/pages/` — all page components (16 pages)
- `artifacts/kryros/src/components/layout/` — Navbar, Sidebar, BottomNav, ProductCard, etc.
- `artifacts/kryros/src/lib/` — CartContext, WishlistContext, CurrencyContext, mockData
- `artifacts/kryros/src/hooks/use-api.ts` — API hook (proxies to backend via Vite proxy)
- `artifacts/kryros/vite.config.ts` — Vite config with `/backend` proxy to external API

## Design System

**Primary brand color only:** `#1FA89A` (HSL 174 69% 39%)

- Text: `#111111` primary, `#555555` secondary, `#767676` muted
- Backgrounds: `#FFFFFF` main, `#F7F7F7` section, `#F5F5F5` soft
- Border: `#E5E5E5`
- Links: `#0654BA` default, `#3665F3` hover
- Status: success `#5BA71B`, warning `#FFB000`, error `#C91432`
- Font: `system-ui, "Segoe UI", Roboto, Arial, sans-serif`
- Default theme: **light** (clean marketplace, eBay-style)

## Architecture decisions

- External backend (`kryrosbackend-rwb2.onrender.com`) is proxied through Vite's dev server at `/backend` to avoid CORS issues in development
- `HERO_SLIDES` static data is used as fallback when CMS banners API is unavailable
- All brand colors go through CSS custom properties — only one brand color (`--primary`) used throughout
- Dark mode is supported but light is the default (`storageKey: "kryros-theme"`)

## Product

16-page e-commerce marketplace:
- Home, Shop, Product Detail, Flash Sales, Financing/BNPL
- Cart, Checkout, Dashboard, Profile, Wishlist
- Notifications, Track Order, Wholesale, Support, Pickup Stations, Login/Register

## User preferences

- Single brand color: `#1FA89A` only — no secondary brand colors
- Clean marketplace UI (eBay-style), not a luxury/dark theme
- System fonts only — no Google Fonts
- Light mode as default

## Gotchas

- Backend proxy path is `/backend` (rewrites to `/` on external server) — API calls in `use-api.ts` use `/backend` + `/api` prefix
- Do not run `pnpm dev` at workspace root — use workflow restart instead
- Theme is stored in localStorage under `kryros-theme` key — clear it if switching defaults

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
