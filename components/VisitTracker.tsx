"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function VisitTracker() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;

    const payload = JSON.stringify({
      path: pathname,
      referrer: document.referrer ?? "",
    });

    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/visits",
        new Blob([payload], { type: "application/json" })
      );
    } else {
      fetch("/api/visits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
      }).catch(() => {});
    }
  }, [pathname]);

  return null;
}
