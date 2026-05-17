import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";

import { AppShell } from "@/components/layout/app-shell";
import "./globals.css";

const bodyFont = Nunito({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["500", "600", "700", "800"]
});

const displayFont = Fredoka({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"]
});

export const metadata: Metadata = {
  title: "Loop | UW Student Marketplace, Rides, and Study Groups",
  description: "Loop is a verified student platform for buying, ridesharing, and study groups at University of Waterloo."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bodyFont.variable} ${displayFont.variable}`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
