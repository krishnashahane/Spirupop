import { NextResponse } from "next/server";
import { sqlClient } from "@/lib/db";
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

  if (!databaseConfigured) {
    return NextResponse.json(
      {
        ok: false,
        siteOrigin: SITE_ORIGIN,
        checks: {
          database: false,
          admin: adminConfigured,
        },
        error: "DATABASE_URL or POSTGRES_URL is not configured.",
      },
      { status: 503 }
    );
  }

  try {
    const sql = sqlClient();
    await sql`SELECT 1`;

    return NextResponse.json({
      ok: true,
      siteOrigin: SITE_ORIGIN,
      checks: {
        database: true,
        admin: adminConfigured,
      },
    });
  } catch (e) {
    console.error("health check database failure", e);
    return NextResponse.json(
      {
        ok: false,
        siteOrigin: SITE_ORIGIN,
        checks: {
          database: false,
          admin: adminConfigured,
        },
        error: "Database connection failed.",
      },
      { status: 503 }
    );
  }
}
