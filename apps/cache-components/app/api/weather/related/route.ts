import { fetchRelatedContent } from "@repo/ui";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await fetchRelatedContent();
  return NextResponse.json(data);
}
