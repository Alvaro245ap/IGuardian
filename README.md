# eguardian

Hospital-first weekly scheduling with auto-reassign on sickness.

## Quick start
1) Copy `.env.example` to `server/.env` and `web/.env.local`
2) Install & seed:
   ```bash
   cd server && npm i && npx prisma migrate dev --name init && npm run seed
   cd ../web && npm i
   ```
3) Run:
   ```bash
   cd server && npm run dev
   # in another terminal
   cd web && npm run dev
   ```
4) Open http://localhost:3000

Database: SQLite by default. For Postgres set `DATABASE_URL` in `server/.env`
to:  `postgresql://USER:PASSWORD@HOST:PORT/DB?schema=public`
then run: `npx prisma migrate deploy`.
