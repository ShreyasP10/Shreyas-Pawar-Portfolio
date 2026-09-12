"use client";

import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useFetch } from "@/lib/useFetch";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";

type HistoryResponse = {
  username: string;
  profileUrl: string;
  ranking: number;
  solved: { all: number; easy: number; medium: number; hard: number };
  streak: number;
  last30: { date: string; count: number }[];
  contestHistory: { title: string; rating: number; ranking: number; date: string }[];
  contestRanking: { attendedContestsCount: number; rating: number; globalRanking: number } | null;
};

function formatRank(n: number) {
  if (!n) return "—";
  return `#${n.toLocaleString()}`;
}

function shortDate(d: string) {
  const dt = new Date(d);
  return `${dt.getMonth() + 1}/${dt.getDate()}`;
}

export function LeetCodeAnalytics() {
  const { data, error } = useFetch<HistoryResponse>("/api/leetcode-history");

  const chartData = useMemo(() => {
    if (!data?.last30) return [];
    return data.last30.map((p) => ({ ...p, label: shortDate(p.date) }));
  }, [data]);

  const totalLast30 = useMemo(() => chartData.reduce((s, p) => s + p.count, 0), [chartData]);
  const avgDaily = chartData.length ? (totalLast30 / chartData.length).toFixed(1) : "0";
  const peak = chartData.length ? Math.max(...chartData.map((p) => p.count)) : 0;

  return (
    <section id="leetcode" className="scroll-mt-24 border-t border-white/5 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          label="leetcode_analytics"
          title="LeetCode Analytics"
          description="All-time ranking and daily activity — like LinkedIn post impressions, but for DSA. Rank improves as you solve; this graph shows daily submissions driving it."
        />

        {!data && !error && (
          <div className="rounded-2xl border border-white/10 bg-panel p-8 text-center text-sm text-muted">Loading LeetCode analytics…</div>
        )}

        {error && !data && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center text-sm text-red-300">
            Could not load LeetCode data right now. Try again later.
          </div>
        )}

        {data && (
          <div className="flex flex-col gap-6">
            {/* Top metrics — LinkedIn-style header */}
            <Reveal>
              <div className="rounded-2xl border border-white/10 bg-panel p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-[11px] tracking-[0.3em] text-accent">LEETCODE • @{data.username}</p>
                    <h3 className="mt-1 text-2xl font-black tracking-tight text-white">
                      Rank {formatRank(data.ranking)}
                      <span className="ml-2 text-sm font-semibold text-muted">· {data.solved.all} solved</span>
                    </h3>
                    <p className="mt-1 text-xs text-muted">
                      Easy {data.solved.easy} · Medium {data.solved.medium} · Hard {data.solved.hard} · Streak {data.streak} days
                    </p>
                  </div>
                  <a
                    href={data.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-white px-4 py-2 text-xs font-bold text-black transition hover:bg-zinc-100"
                  >
                    View profile →
                  </a>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-2 border-y border-white/10 py-4 sm:gap-6">
                  <div className="min-w-0">
                    <p className="font-mono text-[9px] tracking-[0.15em] text-muted sm:text-[10px] sm:tracking-[0.2em]">RANK</p>
                    <p className="mt-1 truncate text-base font-bold text-white sm:text-xl">{formatRank(data.ranking)}</p>
                    <p className="truncate text-[10px] text-muted sm:text-[11px]">Global · all-time</p>
                  </div>
                  <div className="min-w-0">
                    <p className="font-mono text-[9px] tracking-[0.15em] text-muted sm:text-[10px] sm:tracking-[0.2em]">30-DAY SUBS</p>
                    <p className="mt-1 text-base font-bold text-accent sm:text-xl">{totalLast30}</p>
                    <p className="truncate text-[10px] text-muted sm:text-[11px]">{avgDaily} / day · peak {peak}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="font-mono text-[9px] tracking-[0.15em] text-muted sm:text-[10px] sm:tracking-[0.2em]">CONTESTS</p>
                    <p className="mt-1 text-base font-bold text-white sm:text-xl">
                      {data.contestRanking?.attendedContestsCount ?? 0}
                    </p>
                    <p className="truncate text-[10px] text-muted sm:text-[11px]">
                      {data.contestRanking?.rating ? `Rating ${Math.round(data.contestRanking.rating)}` : "No contests yet"}
                    </p>
                  </div>
                </div>

                {/* Graph — LinkedIn impression style */}
                <div className="mt-6">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="font-mono text-xs font-semibold text-white">Daily submissions — last 30 days</p>
                    <p className="font-mono text-[10px] tracking-[0.2em] text-muted">IMPRESSIONS ANALOGY</p>
                  </div>

                  <div className="h-[200px] w-full overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0f] p-2 sm:h-[220px] sm:p-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 10, right: 5, left: -15, bottom: 0 }}>
                        <defs>
                          <linearGradient id="lcFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#ffd700" stopOpacity={0.35} />
                            <stop offset="100%" stopColor="#ffd700" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                        <XAxis dataKey="label" tick={{ fill: "#8f8c99", fontSize: 10 }} axisLine={false} tickLine={false} interval={4} />
                        <YAxis tick={{ fill: "#8f8c99", fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} width={28} />
                        <Tooltip
                          contentStyle={{ background: "#121218", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#fff" }}
                          labelStyle={{ color: "#ffd700", fontSize: 11 }}
                          formatter={(v) => [v as number, "submissions"]}
                        />
                        <Area type="monotone" dataKey="count" stroke="#ffd700" strokeWidth={2.2} fill="url(#lcFill)" dot={false} activeDot={{ r: 3, fill: "#ffd700", stroke: "#0a0a0f", strokeWidth: 2 }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <p className="mt-2 text-center font-mono text-[10px] tracking-[0.2em] text-muted">
                    Each point is submissions that day — rank improves as this line stays up. Like LinkedIn impressions, consistency wins.
                  </p>

                  {data.contestHistory.length === 0 && (
                    <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-xs leading-relaxed text-amber-200/80">
                      <span className="font-bold text-amber-300">Note:</span> LeetCode doesn&apos;t expose global-rank history. This graph shows
                      <span className="text-white"> daily submissions</span> (the driver of rank). Your current rank is{" "}
                      <span className="font-bold text-white">{formatRank(data.ranking)}</span> with {data.solved.all} problems solved.
                      Participate in contests to also get a contest-rating graph.
                    </div>
                  )}


                </div>
              </div>
            </Reveal>
          </div>
        )}
      </div>
    </section>
  );
}
