import type { Route } from "./+types/bookmark-detail";

// TODO: Import Link from "react-router"
// TODO: Import API helpers from "~/lib/api.server"
// TODO: Import Shadcn Card components

// ============================================
// LOADER: Fetch single bookmark by ID
// ============================================
export async function loader({ params }: Route.LoaderArgs) {
  // TODO: Get bookmark by params.id
  // TODO: Throw 404 if not found
  return { bookmark: null };
}

// ============================================
// COMPONENT: Bookmark detail view
// ============================================
export default function BookmarkDetail({ loaderData }: Route.ComponentProps) {
  // TODO: Render bookmark details in a Card
  return <div>Bookmark detail</div>;
}
