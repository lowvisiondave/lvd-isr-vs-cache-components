import { ComponentType, ReactNode } from "react";

export interface SidebarLink {
  href: string;
  label: string;
}

export interface SidebarProps {
  links: SidebarLink[];
  linkComponent?: ComponentType<{
    href: string;
    className?: string;
    children: ReactNode;
  }>;
}

export function Sidebar({
  links,
  linkComponent: Link = "a" as any,
}: SidebarProps) {
  return (
    <aside className="w-56 shrink-0 border-r border-border/40 pr-6">
      <nav className="sticky top-20 space-y-1">
        <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Navigation
        </p>
        <ul className="space-y-1">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current opacity-50" />
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
