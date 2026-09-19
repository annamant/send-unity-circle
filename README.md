# SEND Unity Circle

Parent-led UK network of school WhatsApp groups. This website is the **school index and control centre**.

Parents find their child’s school (official DfE name), join a live group, or start one by pasting a `chat.whatsapp.com` invite. They do **not** have to add a contact. **SEND Unity Circle admin** joins via that link; then the school goes live. Borough WhatsApp Communities are hubs: admin attaches live school groups to them in WhatsApp (this app does not automate that).

## What v1 includes

- Public home (en-GB) explaining the network
- School search by name, postcode, or local authority
- School page: **Join** when live, or **Start group**
- Guided start wizard (exact group name, WhatsApp steps, paste invite → pending)
- Admin area (password): pending queue, mark live after joining, edit/reject links, schools missing groups
- **Family tools** (`/tools`): in-app chat for letters and rights questions (session-only in the browser; not stored on the server)
- Seeded DfE / GIAS open establishments for **London**, including **Lambeth** and **Southwark**, **The Elmgreen School**, and **Kingsdale Foundation School**
- Path to wider England via `npm run import:gias -- --england`

Out of scope: native apps, WhatsApp Cloud API group creation, unofficial WhatsApp bots, chat history storage.

## Stack

- Next.js App Router (v16), TypeScript, Tailwind CSS v4
- Prisma + **Postgres** (Railway Postgres in production; Docker or any Postgres locally)

SQLite is not used. One Prisma schema and one migration history keep production and local aligned.

## Setup

```bash
npm install
cp .env.example .env
# edit ADMIN_PASSWORD (required)
docker compose up -d db
npm run db:setup
npm run dev
```

If you already have Postgres, skip Compose and set `DATABASE_URL` to that database instead.

Open [http://localhost:3000](http://localhost:3000). Admin: [http://localhost:3000/admin](http://localhost:3000/admin). Family tools: [http://localhost:3000/tools](http://localhost:3000/tools).

### Environment

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | yes | Postgres connection string. Local Compose default: `postgresql://postgres:postgres@localhost:5432/send_unity_circle`. On Railway, use the Postgres plugin URL (already attached to the `web` service). |
| `ADMIN_PASSWORD` | yes | Shared password for `/admin` |
| `FOUNDER_WHATSAPP_DISPLAY` | no | Public label for the joining account. Default: `SEND Unity Circle admin` |
| `FOUNDER_WHATSAPP_E164` | no | Backup number to copy in the wizard. Joining via the invite link is the primary path |
| `OPENAI_API_KEY` | for Family tools | OpenAI-compatible API key. If unset, `/tools` shows a friendly unavailable state |
| `OPENAI_MODEL` | no | Chat model. Default: `gpt-4o-mini` |
| `OPENAI_BASE_URL` | no | OpenAI-compatible base URL. Default: `https://api.openai.com/v1` |

Never put a personal first name on the public site; the joining identity is **SEND Unity Circle admin**.

### Family tools

`/tools` is an in-app chat (not a link out to ChatGPT). Optional school context: `/tools?school={slug}` looks up the official school name and local authority and adds them to the system prompt.

Chat history is **session-only in the browser** (`sessionStorage`). The server streams a reply and does not store messages. Without `OPENAI_API_KEY`, the page still loads and explains that tools are temporarily unavailable.

### Deploy (Railway)

Production is Postgres-only. The `web` service should have `DATABASE_URL` from the Railway Postgres plugin.

`railway.json` sets the start command to `npm run start:production`, which is:

```bash
npx prisma migrate deploy
npm run db:seed
npx next start
```

Build remains `npm run build` (`prisma generate` + `next build`). `prisma` and `tsx` are runtime dependencies so migrate + seed work after the image is pruned.

`db:seed` upserts schools by URN. It also applies founder-confirmed live invites from `data/live-groups.json` (The Elmgreen School and Kingsdale Foundation School). Other group statuses are left alone. Re-run seed when you refresh GIAS names.

To mark another school live after the founder confirms the invite:

```bash
npm run group:live -- --urn 136309 --url 'https://chat.whatsapp.com/…'
```

That command stores the normalised `chat.whatsapp.com` path only (tracking query params are dropped).

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
| `npm start` | Start the production server (no migrate) |
| `npm run start:production` | `prisma migrate deploy` + seed + `next start` (Railway) |
| `npm run db:setup` | Apply migrations and seed London GIAS schools |
| `npm run db:seed` | Upsert London schools and founder-confirmed live groups |
| `npm run db:migrate` | `prisma migrate deploy` |
| `npm run group:live` | Mark one school live: `--urn` + `--url` |
| `npm run import:gias` | Download GIAS and upsert London (or `--england`) |
| `npm run lint` | ESLint |

## Licence / data

School names and addresses are Crown copyright, sourced from the DfE GIAS public extract. WhatsApp is a Meta product. This project is not affiliated with the DfE or Meta.
