export interface PageHeaderProps {
	params: Promise<{ slug: string }>;
	subtitle: string;
}

export async function PageHeader({ params, subtitle }: PageHeaderProps) {
	const { slug } = await params;

	return (
		<>
			<h1 className="text-4xl font-bold mb-4">{slug}</h1>
			<p className="text-muted-foreground mb-8">{subtitle}</p>
		</>
	);
}
