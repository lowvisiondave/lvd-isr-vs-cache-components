import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { Header, Sidebar } from "@repo/ui";
const sidebarLinks = [
  { href: "/", label: "Home" },
  { href: "/0/page", label: "Page - 0ms" },
  { href: "/250/page", label: "Page - 250ms" },
  { href: "/500/page", label: "Page - 500ms" },
  { href: "/2000/page", label: "Page - 2s" },
];

export const metadata: Metadata = {
  title: "Cache Components",
  description: "Next.js Cache Components Demo",
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
      <body className="min-h-screen">
        <Header title="Cache Components" />
        <div className="container mx-auto px-6 py-8 flex gap-10">
          <Sidebar links={sidebarLinks} linkComponent={Link as any} />
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
