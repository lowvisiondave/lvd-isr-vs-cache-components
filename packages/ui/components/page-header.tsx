export interface PageHeaderProps {
  params: Promise<{ slug: string; delay: string }>;
  subtitle: string;
}

export async function PageHeader({ params, subtitle }: PageHeaderProps) {
  const { slug, delay } = await params;

  if (delay && Number(delay) > 0) {
    await new Promise((resolve) => setTimeout(resolve, Number(delay)));
  }

  return (
    <>
      <h1 className="text-4xl font-bold mb-4">{slug}</h1>
      <p className="text-muted-foreground mb-8">{subtitle}</p>
    </>
  );
}
