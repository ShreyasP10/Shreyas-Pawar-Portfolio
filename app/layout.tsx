import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { VisitTracker } from "@/components/VisitTracker";
import { CustomCursor } from "@/components/CustomCursor";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://shreyas-pawar-portfolio.vercel.app";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Shreyas Pawar | Developer Portfolio",
    description:
      "Data Science & DSA | Built ML & Mobile Solutions for Real-World Use Cases.",
    type: "website",
    locale: "en_US",
    siteName: "Shreyas Pawar Portfolio",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shreyas Pawar | Developer Portfolio",
    description:
      "Data Science & DSA | Built ML & Mobile Solutions for Real-World Use Cases.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

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
