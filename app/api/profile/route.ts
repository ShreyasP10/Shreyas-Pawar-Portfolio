import { NextResponse } from "next/server";
import { getProfile } from "@/lib/data";

export async function GET() {
  return NextResponse.json(getProfile());
}
