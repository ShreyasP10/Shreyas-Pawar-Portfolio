import { NextResponse } from "next/server";
import { getExperience } from "@/lib/data";

export async function GET() {
  return NextResponse.json(getExperience());
}
