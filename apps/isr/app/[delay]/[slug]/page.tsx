import { ClientFetch, CreatedAt, PageHeader } from "@repo/ui";

export const dynamic = "force-static";

export async function generateMetadata({
  params,
}: PageProps<"/[delay]/[slug]">) {
  const { slug, delay } = await params;

  if (delay && Number(delay) > 0) {
    const start = Date.now();
    while (Date.now() - start <= Number(delay)) {
      // busy wait
    }
  }

  return {
    title: `ISR - ${delay}/${slug}`,
    description: `ISR - ${delay}/${slug}`,
  };
}

export default async function SlugPage({
  params,
}: PageProps<"/[delay]/[slug]">) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <PageHeader params={params} subtitle="ISR" />
      <CreatedAt />
      <ClientFetch params={params} />
    </div>
  );
}
