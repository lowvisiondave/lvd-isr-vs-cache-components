import { fetchWeatherMap } from "@repo/ui";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ city: string }> }
) {
  const { city } = await params;
  const data = await fetchWeatherMap(city);
  return NextResponse.json(data);
}
