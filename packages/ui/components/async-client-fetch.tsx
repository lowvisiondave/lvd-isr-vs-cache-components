import { ClientFetchInner } from "./client-fetch";

export interface ClientFetchProps {
	params: Promise<{ slug: string }>;
	delay?: number;
}

export async function ClientFetch({ params, delay }: ClientFetchProps) {
	const { slug } = await params;

	return <ClientFetchInner slug={slug} delay={delay} />;
}
