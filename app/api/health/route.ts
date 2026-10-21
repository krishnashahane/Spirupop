import { NextResponse } from "next/server";
import { SITE_ORIGIN } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const databaseConfigured = Boolean(
    process.env.DATABASE_URL || process.env.POSTGRES_URL
  );
  const adminConfigured = true;

  return NextResponse.json({
    ok: true,
    siteOrigin: SITE_ORIGIN,
    checks: {
      checkout: true,
      database: databaseConfigured,
      admin: adminConfigured,
    },
    notes: {
      checkout:
        "Checkout and UPI payment do not require database credentials.",
      database:
        "Optional. Needed only for the /admin order-management dashboard.",
      admin:
        "Admin login is always enabled; the password is set in lib/admin.ts.",
    },
  });
}
