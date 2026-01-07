import { ClientFetch, Loading, PageHeader } from "@repo/ui";
import { Suspense } from "react";
import { CreatedAt } from "../../components/created-at";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;

	return {
		title: `Cache Components - ${slug}`,
		description: `Cache Components - ${slug}`,
	};
}

export default async function SlugPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	return (
		<div className="flex flex-col items-center justify-center min-h-[60vh]">
			<Suspense fallback={<Loading />}>
				<PageHeader params={params} subtitle="Cache Components" />
			</Suspense>
			<CreatedAt />
			<Suspense>
				<ClientFetch params={params} />
			</Suspense>
		</div>
	);
}
