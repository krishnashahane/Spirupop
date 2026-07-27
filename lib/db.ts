import { neon } from "@neondatabase/serverless";

function makeSql() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) throw new Error("DATABASE_URL is not configured");
  return neon(url);
}

// Lazy singleton so the module can be imported at build time without the env.
let _sql: ReturnType<typeof makeSql> | null = null;
export function sqlClient() {
  if (!_sql) _sql = makeSql();
  return _sql;
}

// Idempotent schema bootstrap. Runs once per warm instance.
// Tables are sp_-prefixed to avoid colliding with other apps that share this
// Neon database (a bare `users` table already exists there).
let _ready: Promise<void> | null = null;
export function ensureSchema(): Promise<void> {
  if (_ready) return _ready;
  const sql = sqlClient();
  _ready = (async () => {
    await sql`CREATE TABLE IF NOT EXISTS sp_users (
      id BIGSERIAL PRIMARY KEY,
      phone TEXT UNIQUE NOT NULL,
      name TEXT,
      created_at TIMESTAMPTZ DEFAULT now()
    )`;
    await sql`CREATE TABLE IF NOT EXISTS sp_orders (
      id BIGSERIAL PRIMARY KEY,
      user_id BIGINT REFERENCES sp_users(id),
      tier_id TEXT NOT NULL,
      item_title TEXT NOT NULL,
      amount INT NOT NULL,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      address TEXT NOT NULL,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      pincode TEXT NOT NULL,
      ip TEXT,
      status TEXT DEFAULT 'awaiting_payment',
      created_at TIMESTAMPTZ DEFAULT now()
    )`;
    // Migrate tables created by an earlier version (CREATE IF NOT EXISTS won't).
    await sql`ALTER TABLE sp_orders ADD COLUMN IF NOT EXISTS ip TEXT`;
    await sql`CREATE INDEX IF NOT EXISTS sp_orders_phone_idx ON sp_orders (phone, created_at)`;
    await sql`CREATE INDEX IF NOT EXISTS sp_orders_ip_idx ON sp_orders (ip, created_at)`;
  })().catch((e) => {
    _ready = null; // allow retry on next request
    throw e;
  });
  return _ready;
}
