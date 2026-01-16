import { CreatedAt as BaseCreatedAt, CACHE_LIFE_PROFILES } from "@repo/ui";
import { cacheLife } from "next/cache";

export async function CreatedAt() {
	"use cache";
	// Short cache life to show when page shell was generated
	cacheLife(CACHE_LIFE_PROFILES.pageShell);

	return <BaseCreatedAt />;
}
