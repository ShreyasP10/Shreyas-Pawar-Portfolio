import { mkdir, readFile, appendFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { join } from "node:path";
import { NextResponse } from "next/server";
import { getClientIp, rateLimit } from "@/lib/rateLimit";

const VISITS_DIR = process.env.VERCEL ? "/tmp" : join(process.cwd(), "data");
const VISITS_FILE = join(VISITS_DIR, "visits.jsonl");
const MAX_FIELD_LENGTH = 200;
const MAX_USER_AGENT_LENGTH = 300;

function safePath(value: unknown): string {
  if (typeof value !== "string") return "/";
  const withoutQuery = value.split(/[?#]/)[0]?.trim() ?? "";
  if (!withoutQuery.startsWith("/")) return "/";
  return withoutQuery.slice(0, MAX_FIELD_LENGTH);
}

function safeReferrer(value: unknown): string {
  if (typeof value !== "string" || value.length === 0) return "";
  try {
    return new URL(value).origin.slice(0, MAX_FIELD_LENGTH);
  } catch {
    return "";
  }
}

function hashIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex").slice(0, 16);
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limit = rateLimit(`visits:${ip}`, 120, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { success: false, error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  let body: { path?: unknown; referrer?: unknown } = {};
  try {
    body = await request.json();
  } catch {
    // ignore malformed bodies
  }

  const userAgent = (request.headers.get("user-agent") ?? "unknown").slice(
    0,
    MAX_USER_AGENT_LENGTH
  );

  const entry = JSON.stringify({
    time: new Date().toISOString(),
    path: safePath(body.path),
    referrer: safeReferrer(body.referrer),
    ip: hashIp(ip),
    userAgent,
  });

  try {
    await mkdir(VISITS_DIR, { recursive: true });
    await appendFile(VISITS_FILE, `${entry}\n`, "utf8");
  } catch {
    // file may be read-only (Vercel) - entry is still logged below
  }

  console.log("[visit]", { path: safePath(body.path) });

  return NextResponse.json({ success: true });
}

export async function GET(request: Request) {
  const ip = getClientIp(request);
  const limit = rateLimit(`visits-read:${ip}`, 60, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

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
