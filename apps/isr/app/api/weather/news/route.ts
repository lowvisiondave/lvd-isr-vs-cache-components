import { fetchNewsArticles } from "@repo/ui";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await fetchNewsArticles();
  return NextResponse.json(data);
}
