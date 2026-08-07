import { mkdir, readFile, appendFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";

const VISITS_DIR = process.env.VERCEL ? "/tmp" : join(process.cwd(), "data");
const VISITS_FILE = join(VISITS_DIR, "visits.jsonl");

export async function POST(request: Request) {
  let body: { path?: string; referrer?: string } = {};
  try {
    body = await request.json();
  } catch {
    // ignore malformed bodies
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";
  const userAgent = request.headers.get("user-agent") ?? "unknown";

  const entry = JSON.stringify({
    time: new Date().toISOString(),
    path: body.path ?? "/",
    referrer: body.referrer ?? "",
    ip,
    userAgent,
  });

  try {
    await mkdir(VISITS_DIR, { recursive: true });
    await appendFile(VISITS_FILE, `${entry}\n`, "utf8");
  } catch {
    // file may be read-only (Vercel) — entry is still logged below
  }

  console.log("[visit]", entry);

  return NextResponse.json({ success: true });
}

export async function GET() {
  try {
    const raw = await readFile(VISITS_FILE, "utf8");
    const rows: Record<string, unknown>[] = [];
    for (const line of raw.split("\n")) {
      if (!line) continue;
      try {
        rows.push(JSON.parse(line) as Record<string, unknown>);
      } catch {
        // skip malformed lines
      }
    }

    const paths = new Map<string, number>();
    const referrers = new Map<string, number>();
    const uniqueIps = new Set<string>();

    for (const row of rows) {
      paths.set(String(row.path), (paths.get(String(row.path)) ?? 0) + 1);
      const ref = row.referrer ? String(row.referrer) : "direct";
      referrers.set(ref, (referrers.get(ref) ?? 0) + 1);
      if (row.ip) uniqueIps.add(String(row.ip));
    }

    return NextResponse.json({
      total: rows.length,
      uniqueVisitors: uniqueIps.size,
      paths: Object.fromEntries(paths),
      referrers: Object.fromEntries(referrers),
    });
  } catch {
    return NextResponse.json({ total: 0, uniqueVisitors: 0 });
  }
}
