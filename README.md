# Onbored

Predict churn during onboarding. Know who's stuck, why they're dropping off, and what to fix — in dollars, not dashboards (or revenue of choice).

Built account-first. Tracks revenue, not vanity metrics.

---

## What It Does

- **Account-first tracking** — events buffer pre-auth, flush on identify. Built for B2B multi-tenant.
- **Revenue context** — alerts show "$2.4k MRR at risk – Acme stuck on API setup", not "User XYZ hasn't logged in"
- **Funnel tracking** — map signup → activation, see drop-offs by account value
- **Session replay** — watch what happened (privacy-first, auto-masked)
- **Health scores** — 0-100 activation score per account, updates live
- **Behavioural signals** — rage clicks, hesitation, form abandons, API usage

---

## Quick Start

```bash
npm i onbored-js
```

```typescript
import { onbored } from 'onbored-js';

onbored.init({ projectKey: 'pk_live_...' });
onbored.identifyAccount('acct_123', { plan: 'enterprise' });
onbored.funnel('onboarding');
onbored.step('api-key-created', { slug: 'onboarding' });
onbored.complete({ slug: 'onboarding' });
```

Events appear at [app.onbored.io](https://app.onbored.io) instantly.

**SDK docs:** [onbored-js](https://github.com/MohamedH1998/onbored-js)

---

## Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS 4, Radix UI
- **Backend:** Cloudflare Workers, Tinybird
- **Database:** PostgreSQL (Supabase), Prisma
- **Replay:** RRWeb, gzip compression
- **Auth:** Better Auth
- **Monorepo:** Turborepo, pnpm

---

## Running Locally

**Prerequisites:** Node.js 18+, pnpm, Supabase CLI

```bash
# Clone + install
git clone https://github.com/MohamedH1998/onbored.git
cd onbored
pnpm install

# Setup env files
cp packages/database/.env.example packages/database/.env
cp apps/web/.env.example apps/web/.env

# Start Supabase (from packages/database)
cd packages/database && npx supabase start && cd ../..

# Seed DB (from root)
pnpm db:seed

# Run web app
pnpm --filter web dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
apps/
  web/                  # Next.js dashboard
  ingestion-worker/     # Cloudflare Worker (event ingest)
  landing/              # Marketing site
packages/
  database/             # Prisma schema, migrations, Supabase config
  tinybird/             # Analytics datasources + pipes
  react-email/          # Email templates
  config-eslint/        # Shared ESLint config
  config-typescript/    # Shared TS config
```

---

## Running the Ingestion Worker

The worker handles SDK event ingestion. Run alongside web app for full stack:

```bash
# Setup worker env (from root)
cd apps/ingestion-worker
cp .dev.vars.staging .dev.vars

# Run worker (separate terminal)
pnpm --filter ingestion-worker dev
```

Worker runs on [http://localhost:8787](http://localhost:8787)

**Required vars in `.dev.vars`:**
- `TINYBIRD_WRITE_TOKEN` — from Tinybird workspace
- `WEB_APP_URL` — `http://localhost:3000` for local
- `SYNC_SECRET` — matches web app's `SYNC_SECRET`

See [Tinybird Setup](#tinybird-setup) for token generation.

---

## Working with the SDK

Develop against local SDK:

```bash
# Clone SDK
git clone https://github.com/MohamedH1998/onbored-js.git ../onbored-js
cd ../onbored-js
pnpm install && pnpm build

# Link in apps/web/package.json
{
  "dependencies": {
    "onbored-js": "file:../../onbored-js"
  }
}

# Reinstall
cd apps/web
pnpm install
```

---

## Environment Variables

### Web App (`apps/web/.env`)

**Database:**
- `DATABASE_URL` — Supabase connection string (auto from `supabase start`)
- `DIRECT_URL` — Direct Postgres connection

**Auth:**
- `BETTER_AUTH_SECRET` — Random string for session encryption
- `BETTER_AUTH_URL` — `http://localhost:3000` locally
- `GOOGLE_CLIENT_ID` — [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
- `GOOGLE_CLIENT_SECRET` — Same as above

**Integrations:**
- `RESEND_API_KEY` — [Resend](https://resend.com) for transactional emails
- `TINYBIRD_READ_TOKEN` — Query analytics data
- `SYNC_SECRET` — Shared secret with worker (must match)

**Optional:**
- `ONBORED_API_KEY` — SDK key for internal tracking
- `CRON_SECRET` — Secure cron endpoints

### Worker (`apps/ingestion-worker/.dev.vars`)

- `TINYBIRD_WRITE_TOKEN` — Ingest events to Tinybird
- `TINYBIRD_BASE_URL` — `http://127.0.0.1:7181/v0` for local Tinybird
- `WEB_APP_URL` — Web app origin for CORS
- `SYNC_SECRET` — Matches web app
- `PROJECT_RATE_LIMITER` — Max events/sec per project
- `ENVIRONMENT` — `staging` or `production`

---

## Scripts

Monorepo uses Turborepo. All commands run from root unless noted.

**Root:**
- `pnpm dev` — start web + worker in parallel
- `pnpm build` — build all packages
- `pnpm lint` — lint all apps
- `pnpm --filter web dev` — run web app only
- `pnpm --filter ingestion-worker dev` — run worker only

**Database (run from root):**
- `pnpm db:migrate:dev` — create + apply migration
- `pnpm db:push` — push schema changes (dev only)
- `pnpm db:seed` — seed with demo data
- `pnpm generate` — regenerate Prisma client (run after schema changes)

---

## Tinybird Setup

Tinybird powers real-time analytics. Two options:

### Option 1: Local Tinybird (Recommended for Development)

```bash
# Install Tinybird CLI
curl https://www.tinybird.co/assets/install.sh | bash

# Start local Tinybird
cd packages/tinybird
tb dev --port 7181
```

Tokens auto-generated in local mode. Update:
- Web app: `TINYBIRD_BASE_URL=http://127.0.0.1:7181/v0`
- Worker: Same as above

### Option 2: Tinybird Cloud

1. Create workspace at [tinybird.co](https://www.tinybird.co)
2. Deploy datasources:
   ```bash
   cd packages/tinybird
   tb auth --token <your_admin_token>
   tb push
   ```
3. Generate tokens in workspace settings:
   - **READ**: for web app queries
   - **WRITE**: for worker event ingest
4. Update `.env` files with cloud URL + tokens

---

## Supabase Setup

**First-time setup:**

```bash
# Install Supabase CLI
brew install supabase/tap/supabase

# Start local instance
cd packages/database
npx supabase start
```

This prints connection details. `DATABASE_URL` auto-updates in `.env`.

**Reset database:**
```bash
npx supabase db reset
```

---

## Schema

- **Users** — auth, profiles
- **Workspaces** — multi-tenant orgs
- **Projects** — analytics instances
- **Funnels** — conversion definitions
- **Flows** — user sessions
- **Events** — interaction tracking
- **API Keys** — SDK auth
- **Insights** — computed metrics

---

## Development

### Adding Features

1. **Database changes:**
   - Edit `packages/database/prisma/schema.prisma`
   - Run `pnpm db:migrate:dev --name feature_name`
   - Run `pnpm generate` to update Prisma client

2. **API endpoints:**
   - Add routes in `apps/web/app/api/`
   - Use `@repo/database` for DB access

3. **UI components:**
   - Shared: `apps/web/components/`
   - Pages: `apps/web/app/`

4. **Worker logic:**
   - Event processing: `apps/ingestion-worker/src/`
   - Test locally before deploying

### Monorepo Workflow

This is a Turborepo monorepo. Packages reference each other via workspace protocol:

```json
{
  "dependencies": {
    "@repo/database": "workspace:*"
  }
}
```

**Key packages:**
- `@repo/database` — Prisma client, shared by web + worker
- `@repo/email` — React Email templates
- `@repo/eslint-config` — Shared ESLint rules
- `@repo/typescript-config` — Shared tsconfig

Changes to shared packages auto-rebuild dependent apps in dev mode.

---

## Deployment

### Ingestion Worker

Auto-deploys via GitHub Actions on push to `main`:

```yaml
# Trigger: changes to apps/ingestion-worker/** or packages/database/**
# Action: .github/workflows/deploy-worker.yml
```

**Required Cloudflare secrets:**
1. Add to repository secrets: `CLOUDFLARE_API_TOKEN`
2. Add to Cloudflare Worker environment variables:
   - `TINYBIRD_WRITE_TOKEN`
   - `WEB_APP_URL`
   - `SYNC_SECRET`
   - `PROJECT_RATE_LIMITER`
   - `ENVIRONMENT`

**Manual deploy:**
```bash
cd apps/ingestion-worker
pnpm run deploy -- --env production
```

### Web App

Deploy to Vercel/similar:

1. Set all [environment variables](#environment-variables)
2. Point to production Supabase + Tinybird
3. Build command: `pnpm build --filter web`
4. Output: `apps/web/.next`

---

## Troubleshooting

**Events not appearing:**
- Check worker logs: `wrangler tail`
- Verify `SYNC_SECRET` matches in web + worker
- Confirm Tinybird tokens have correct permissions

**Database connection failed:**
- Ensure Supabase running: `npx supabase status`
- Check `DATABASE_URL` in `.env`
- Try `pnpm db:push` to sync schema

**Worker CORS errors:**
- Update `WEB_APP_URL` in worker `.dev.vars`
- Check `apps/ingestion-worker/src/index.ts` allowed origins

**Build errors:**
- Run `pnpm generate` to regenerate Prisma client
- Clear `.next` and `node_modules/.cache`

**Google OAuth not working:**
- Verify redirect URIs in Google Cloud Console include `http://localhost:3000/api/auth/callback/google`
- Check `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET`

---

[Website](https://onbored.io) • [SDK](https://github.com/MohamedH1998/onbored-js) • [Issues](https://github.com/MohamedH1998/onbored/issues)

**Support:** info@onbored.io • [@momito](https://twitter.com/momito)

MIT © Onbored
