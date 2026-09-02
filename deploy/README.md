# Deploying (Vercel + Turso, no local Node/CLI needed)

This folder is the whole deployable app: the pre-built frontend (`index.html`,
`assets/`) plus the backend API (`api/`, `db/`) as Vercel serverless functions.
Everything below is done through web dashboards.

## 1. Turso — create the database

1. Go to https://app.turso.tech and sign in.
2. Create a new database (any name, e.g. `biblical-literacy`).
3. Open its **Shell / Query** tab and run the contents of [`schema.sql`](./schema.sql)
   to create the `progress` and `notes` tables.
4. From the database's settings, copy:
   - the **Database URL** (starts with `libsql://...`) -> this is `TURSO_DATABASE_URL`
   - an **Auth Token** (create one if none exists) -> this is `TURSO_AUTH_TOKEN`

## 2. GitHub — push this code

1. Create a new empty repository on GitHub (no README/gitignore, so upload doesn't conflict).
2. On the repo page, use **Add file -> Upload files** and drag in everything
   inside this `deploy/` folder (`index.html`, `assets/`, `api/`, `db/`,
   `drizzle.config.ts`, `package.json`, `vercel.json`, `schema.sql`) — commit.

## 3. Vercel — import and deploy

1. Go to https://vercel.com/new and import the GitHub repo you just created.
2. Framework Preset: **Other**. Leave Build Command / Output Directory blank
   (the frontend is already built; Vercel serves `index.html`/`assets/`
   directly and auto-detects `api/*.ts` as serverless functions).
3. Under **Environment Variables**, add:
   - `TURSO_DATABASE_URL`
   - `TURSO_AUTH_TOKEN`
4. Click **Deploy**.

That's it — the site is live at the `*.vercel.app` URL Vercel gives you, with
no local build or dev server involved. Later code changes: push to GitHub and
Vercel redeploys automatically.
