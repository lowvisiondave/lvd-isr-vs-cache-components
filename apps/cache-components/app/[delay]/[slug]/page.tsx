import { ClientFetch, Loading, PageHeader } from "@repo/ui";
import { Suspense } from "react";
import { CreatedAt } from "@/components/created-at";

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
    title: `Cache Components - ${delay}/${slug}`,
    description: `Cache Components - ${delay}/${slug}`,
  };
}

export default function SlugPage({ params }: PageProps<"/[delay]/[slug]">) {
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
