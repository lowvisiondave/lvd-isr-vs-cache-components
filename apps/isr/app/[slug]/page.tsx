import { ClientFetch } from "@repo/ui";

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return {
    title: `ISR Page - ${slug}`,
    description: `ISR Page - ${slug}`,
  };
}

export default async function SlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const createdAt = new Date().toISOString();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-4xl font-bold mb-4">{slug}</h1>
      <p className="text-muted-foreground mb-8">ISR Page</p>
      <p className="text-sm text-muted-foreground mb-8">
        Created at: <code className="font-mono">{createdAt}</code>
      </p>
      <ClientFetch />
    </div>
  );
}
