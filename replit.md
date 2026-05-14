# Kryros

Kryros is a Zambian e-commerce marketplace app where users can shop for products, track orders, manage a cart and wishlist, apply financing, and pay via mobile money operators (Airtel, MTN, Zamtel).

## Run & Operate

- `pnpm --filter @workspace/kryros run dev` — run the frontend (port 19796)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 19, Vite, Tailwind CSS v4, Wouter (routing), TanStack Query, Radix UI, Framer Motion
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/kryros/` — Main React frontend
- `artifacts/kryros/src/index.css` — All theme variables (colors, fonts, dark/light mode)
- `artifacts/api-server/` — Express backend
- `lib/db/src/schema/` — Database schema (Drizzle)
- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth)
- `lib/api-client-react/` — Generated React Query hooks
- `lib/api-zod/` — Generated Zod schemas

## Architecture decisions

- Frontend proxies API calls through `/backend` in Vite dev server to the external backend on Render.com
- Dark/light mode controlled by `.dark` class on root, toggled via `ThemeProvider`
- All theme colors and font sizes live exclusively in `artifacts/kryros/src/index.css` CSS variables — never hardcoded in components

## Product

- Home page with hero carousel, flash sales, featured products
- Shop page with filters and product grid
- Product detail with images, variants, reviews
- Cart, Checkout, Wishlist, Order tracking
- User auth (login/register/profile/dashboard)
- Mobile money payment flow (Airtel, MTN, Zamtel)
- Wholesale and Financing pages

## User preferences

- Dark mode background: `#101115` (matches `--product-page-bg` dark)
- Light mode background: `#f4f6f8` (matches `--product-page-bg` light)
- Font: Inter, size 17px base, weight 500 (medium-bold) for body text
- All theme changes must be made in `artifacts/kryros/src/index.css` CSS variables only

## Gotchas

- Font sizes are defined in the `@theme inline` block as CSS variables (`--text-base`, etc.) AND as explicit px values on `html`/`body`. Both must be updated together.
- Tailwind v4 uses `@theme` blocks — not `tailwind.config.js`
- Dark mode uses `.dark` class selector (not `prefers-color-scheme` media query)

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
