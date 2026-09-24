import { NextResponse } from "next/server";
import { SITE_ORIGIN } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const databaseConfigured = Boolean(
    process.env.DATABASE_URL || process.env.POSTGRES_URL
  );
  const adminConfigured = Boolean(
    process.env.ADMIN_PASSWORD || process.env.ADMIN_SECRET
  );

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
        "Optional. Configure ADMIN_PASSWORD or ADMIN_SECRET to enable admin login.",
    },
  });
}
