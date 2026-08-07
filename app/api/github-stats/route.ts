import { NextResponse } from "next/server";

const GITHUB_USERNAME = "ShreyasP10";
const FALLBACK_FOLLOWERS = 19;

export async function GET() {
  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json({ followers: FALLBACK_FOLLOWERS });
    }

    const data = (await res.json()) as { followers?: number };
    const followers =
      typeof data.followers === "number" ? data.followers : FALLBACK_FOLLOWERS;

    return NextResponse.json({ followers });
  } catch {
    return NextResponse.json({ followers: FALLBACK_FOLLOWERS });
  }
}
