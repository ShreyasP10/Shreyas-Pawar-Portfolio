import { NextResponse } from "next/server";
import { getHackathons } from "@/lib/data";

export async function GET() {
  return NextResponse.json(getHackathons());
}
