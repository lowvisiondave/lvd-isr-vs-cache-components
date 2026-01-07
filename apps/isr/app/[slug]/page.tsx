import { ClientFetch, CreatedAt, PageHeader } from "@repo/ui";

export const dynamic = "force-static";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;

	return {
		title: `ISR - ${slug}`,
		description: `ISR - ${slug}`,
	};
}

export default async function SlugPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	return (
		<div className="flex flex-col items-center justify-center min-h-[60vh]">
			<PageHeader params={params} subtitle="ISR" />
			<CreatedAt />
			<ClientFetch params={params} />
		</div>
	);
}
