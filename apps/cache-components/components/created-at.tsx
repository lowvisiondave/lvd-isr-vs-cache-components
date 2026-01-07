import { CreatedAt as BaseCreatedAt } from "@repo/ui";

export async function CreatedAt() {
	"use cache";

	return <BaseCreatedAt />;
}
