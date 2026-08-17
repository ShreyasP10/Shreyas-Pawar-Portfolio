import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { VisitTracker } from "@/components/VisitTracker";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shreyas Pawar | Developer Portfolio",
  description:
    "Data Science & DSA | Built ML & Mobile Solutions for Real-World Use Cases. Portfolio of Shreyas Pawar — projects, experience and contact.",
  keywords: [
    "Shreyas Pawar",
    "Portfolio",
    "Data Science",
    "Machine Learning",
    "Android Development",
    "Next.js",
    "Flutter",
  ],
  authors: [{ name: "Shreyas Pawar", url: "https://github.com/ShreyasP10" }],
  openGraph: {
    title: "Shreyas Pawar | Developer Portfolio",
    description:
      "Data Science & DSA | Built ML & Mobile Solutions for Real-World Use Cases.",
    type: "website",
    locale: "en_US",
    siteName: "Shreyas Pawar Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shreyas Pawar | Developer Portfolio",
    description:
      "Data Science & DSA | Built ML & Mobile Solutions for Real-World Use Cases.",
  },
};

import { CustomCursor } from "@/components/CustomCursor";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CustomCursor />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-xs focus:font-bold focus:text-ink focus:shadow-lg focus:outline-none"
        >
          Skip to main content
        </a>
        {children}
        <VisitTracker />
        <Analytics />
      </body>
    </html>
  );
}
