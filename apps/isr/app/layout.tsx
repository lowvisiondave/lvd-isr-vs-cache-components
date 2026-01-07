import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { Header, Sidebar } from "@repo/ui";

const sidebarLinks = [
  { href: "/", label: "Home" },
  { href: "/page-1", label: "Page 1" },
  { href: "/page-2", label: "Page 2" },
  { href: "/page-3", label: "Page 3" },
];

export const metadata: Metadata = {
  title: "ISR",
  description: "ISR App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header title="ISR" />
        <div className="container mx-auto px-4 py-8 flex gap-8">
          <Sidebar links={sidebarLinks} linkComponent={Link} />
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
