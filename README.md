# SEND Unity Circle

Parent-led UK network of school WhatsApp groups. This website is the **school index and control centre**.

Parents find their child’s school (official DfE name), join a live group, or start one by pasting a `chat.whatsapp.com` invite. They do **not** have to add a contact. **SEND Unity Circle admin** joins via that link; then the school goes live. Borough WhatsApp Communities are hubs: admin attaches live school groups to them in WhatsApp (this app does not automate that).

## What v1 includes

- Public home (en-GB) explaining the network
- School search by name, postcode, or local authority
- School page: **Join** when live, or **Start group**
- Guided start wizard (exact group name, WhatsApp steps, paste invite → pending)
- Admin area (password): pending queue, mark live after joining, edit/reject links, schools missing groups
- Seeded DfE / GIAS open establishments for **London**, including **Lambeth** and **Southwark**, **The Elmgreen School**, and **Kingsdale Foundation School**
- Path to wider England via `npm run import:gias -- --england`

Out of scope: Family Tool AI, native apps, WhatsApp Cloud API group creation, unofficial WhatsApp bots.

## Stack

- Next.js App Router (v16), TypeScript, Tailwind CSS v4
- Prisma + **SQLite** for local and simple deploys
- Switch to **Postgres** when you need a hosted database (Vercel/Neon, Railway Postgres, etc.)

SQLite is the default so `npm run dev` works with no extra services. It is a good fit for a VPS, Fly.io, or Railway **with a persistent volume**. Serverless hosts such as Vercel do not persist a SQLite file — use Postgres there.

## Setup

```bash
npm install
cp .env.example .env
# edit ADMIN_PASSWORD (required)
npm run db:setup
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Admin: [http://localhost:3000/admin](http://localhost:3000/admin).

### Environment

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | yes | Prisma database URL. Local SQLite: `file:./dev.db` (path is relative to `prisma/`) |
| `ADMIN_PASSWORD` | yes | Shared password for `/admin` |
| `FOUNDER_WHATSAPP_DISPLAY` | no | Public label for the joining account. Default: `SEND Unity Circle admin` |
| `FOUNDER_WHATSAPP_E164` | no | Backup number to copy in the wizard. Joining via the invite link is the primary path |

Never put a personal first name on the public site; the joining identity is **SEND Unity Circle admin**.

### Production database (Postgres)

1. Create a Postgres database (Neon, Railway, Supabase, …).
2. In `prisma/schema.prisma`, change `provider = "sqlite"` to `provider = "postgresql"`.
3. Set `DATABASE_URL` to the Postgres URL (and `DIRECT_URL` if your host asks for it).
4. Generate a new migration (`npx prisma migrate dev`) or reset migrations for the first production database.
5. Run `npx prisma migrate deploy` and `npm run db:seed` (or `npm run import:gias -- --england`).

The schema avoids SQLite-only types so this switch stays small.

### Deploy notes

Suggested production start:

```bash
npx prisma migrate deploy
npm run db:seed
npm run build
npm start
```

`db:seed` upserts schools by URN and does not wipe group statuses. Re-run it when you refresh GIAS names.

To load **all open English establishments** from the daily GIAS extract:

```bash
npm run import:gias -- --england
```

London-only refresh:

```bash
npm run import:gias
```

Data source: [Get Information about Schools](https://www.get-information-schools.service.gov.uk/) daily CSV (`edubasealldataYYYYMMDD.csv`). The committed seed is London open establishments from that extract (2026-09-19 snapshot).

## How the live path works

1. A parent finds the school and starts a group using the **exact** name shown (`{Official school name} | SEND Unity Circle`).
2. They create the WhatsApp group themselves and paste the invite.
3. Status becomes **pending**.
4. SEND Unity Circle admin opens the link, joins, then marks the school **live** in `/admin`.
5. Later, in WhatsApp, admin attaches the group to the borough Community. The UI documents this; the app does not call WhatsApp to attach it.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Next.js dev server |
| `npm run build` | `prisma generate` + production build |
| `npm start` | Start the production server |
| `npm run db:setup` | Apply migrations and seed London GIAS schools |
| `npm run db:seed` | Upsert London schools from `data/london-schools.json` |
| `npm run import:gias` | Download GIAS and upsert London (or `--england`) |
| `npm run lint` | ESLint |

## Licence / data

School names and addresses are Crown copyright, sourced from the DfE GIAS public extract. WhatsApp is a Meta product. This project is not affiliated with the DfE or Meta.
