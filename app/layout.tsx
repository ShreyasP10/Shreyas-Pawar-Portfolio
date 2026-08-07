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
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <VisitTracker />
        <Analytics />
      </body>
    </html>
  );
}
