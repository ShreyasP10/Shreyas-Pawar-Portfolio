import { NextResponse } from "next/server";
import { getProjects } from "@/lib/data";

export async function GET() {
  return NextResponse.json(getProjects());
}
