import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { Header, Sidebar } from "@repo/ui";

// Weather cities for demo
const sidebarLinks = [
  { href: "/", label: "Home" },
  // Popular cities (high cache hit rate)
  { href: "/new-york", label: "🏙️ New York" },
  { href: "/los-angeles", label: "🌴 Los Angeles" },
  { href: "/chicago", label: "🌬️ Chicago" },
  { href: "/miami", label: "🌊 Miami" },
  // Medium cities
  { href: "/seattle", label: "☔ Seattle" },
  { href: "/denver", label: "🏔️ Denver" },
  // Long-tail example
  { href: "/small-town-usa", label: "🏘️ Small Town" },
];

export const metadata: Metadata = {
  title: "Cache Components Weather Demo",
  description: "Next.js Cache Components Demo with Weather Data",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background">
        <Header title="Cache Components Weather Demo" />
        <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
          <Sidebar links={sidebarLinks} linkComponent={Link as any} />
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </body>
    </html>
  );
}
