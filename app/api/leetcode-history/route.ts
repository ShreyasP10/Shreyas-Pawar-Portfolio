import { NextResponse } from "next/server";

const USERNAME = "ShreyasPawar10";

interface CalendarPoint {
  date: string;
  count: number;
}

export async function GET() {
  const query = `
    query leetHistory($username: String!) {
      matchedUser(username: $username) {
        profile { ranking }
        submitStatsGlobal { acSubmissionNum { difficulty count } }
        userCalendar { streak submissionCalendar }
      }
      userContestRanking(username: $username) {
        attendedContestsCount
        rating
        globalRanking
      }
      userContestRankingHistory(username: $username) {
        attended
        rating
        ranking
        contest { title startTime }
      }
    }
  `;

  try {
    const res = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json", Referer: "https://leetcode.com" },
      body: JSON.stringify({ query, variables: { username: USERNAME } }),
      next: { revalidate: 3600 },
    });

    if (!res.ok) return NextResponse.json({ error: "LeetCode fetch failed" }, { status: 502 });

    const json = await res.json();
    const user = json.data?.matchedUser;
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const ranking: number = user.profile?.ranking ?? 0;
    const ac = user.submitStatsGlobal?.acSubmissionNum ?? [];
    const solved = {
      all: ac.find((d: { difficulty: string }) => d.difficulty === "All")?.count ?? 0,
      easy: ac.find((d: { difficulty: string }) => d.difficulty === "Easy")?.count ?? 0,
      medium: ac.find((d: { difficulty: string }) => d.difficulty === "Medium")?.count ?? 0,
      hard: ac.find((d: { difficulty: string }) => d.difficulty === "Hard")?.count ?? 0,
    };
    const streak: number = user.userCalendar?.streak ?? 0;

    // Parse submissionCalendar: stringified JSON { timestamp: count }
    let calendar: CalendarPoint[] = [];
    try {
      const raw = JSON.parse(user.userCalendar?.submissionCalendar ?? "{}") as Record<string, number>;
      calendar = Object.entries(raw)
        .map(([ts, count]) => {
          const d = new Date(Number(ts) * 1000);
          const date = d.toISOString().slice(0, 10);
          return { date, count };
        })
        .sort((a, b) => a.date.localeCompare(b.date));
      // Keep last 90 days
      calendar = calendar.slice(-90);
    } catch {
      calendar = [];
    }

    const contestHistory = (json.data?.userContestRankingHistory ?? [])
      .filter((h: { attended: boolean }) => h.attended)
      .map((h: { rating: number; ranking: number; contest: { title: string; startTime: number } }) => ({
        title: h.contest.title,
        rating: Math.round(h.rating),
        ranking: h.ranking,
        date: new Date(h.contest.startTime * 1000).toISOString().slice(0, 10),
      }));

    const contestRanking = json.data?.userContestRanking ?? null;

    // Build daily submissions for graph: fill gaps with 0 for last 30 days for LinkedIn-style view
    const last30: CalendarPoint[] = [];
    const today = new Date();
    const map = new Map(calendar.map((p) => [p.date, p.count]));
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const date = d.toISOString().slice(0, 10);
      last30.push({ date, count: map.get(date) ?? 0 });
    }

    return NextResponse.json({
      username: USERNAME,
      profileUrl: `https://leetcode.com/u/${USERNAME}/`,
      ranking,
      solved,
      streak,
      calendar,
      last30,
      contestHistory,
      contestRanking,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
