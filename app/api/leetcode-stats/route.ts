import { NextResponse } from "next/server";

const LEETCODE_USERNAME = "ShreyasPawar10";
const FALLBACK_RANKING = 150000;
const FALLBACK_SOLVED = 200;

const query = `
  query userProfile($username: String!) {
    matchedUser(username: $username) {
      profile {
        ranking
      }
      submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
        }
      }
    }
  }
`;

export async function GET() {
  try {
    const res = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables: { username: LEETCODE_USERNAME } }),
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json({ ranking: FALLBACK_RANKING, solved: FALLBACK_SOLVED });
    }

    const data = await res.json();
    const user = data.data?.matchedUser;

    if (!user) {
      return NextResponse.json({ ranking: FALLBACK_RANKING, solved: FALLBACK_SOLVED });
    }

    const ranking = user.profile?.ranking ?? FALLBACK_RANKING;
    const solved = user.submitStatsGlobal?.acSubmissionNum?.find(
      (d: { difficulty: string }) => d.difficulty === "All"
    )?.count ?? FALLBACK_SOLVED;

    return NextResponse.json({ ranking, solved });
  } catch {
    return NextResponse.json({ ranking: FALLBACK_RANKING, solved: FALLBACK_SOLVED });
  }
}