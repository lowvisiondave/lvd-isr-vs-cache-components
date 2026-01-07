import type { ComponentType, ReactNode } from "react";

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
		<aside className="w-52 shrink-0">
			<nav className="sticky top-24">
				<div className="rounded-xl border bg-card p-4 shadow-sm">
					<p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
						Pages
					</p>
					<ul className="space-y-1">
						{links.map((link) => (
							<li key={link.href}>
								<Link
									href={link.href}
									className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-foreground/70 transition-all hover:bg-secondary hover:text-foreground"
								>
									<span className="h-1.5 w-1.5 rounded-full bg-primary/50" />
									{link.label}
								</Link>
							</li>
						))}
					</ul>
				</div>
			</nav>
		</aside>
	);
}
