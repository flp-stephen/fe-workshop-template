import type { Route } from "./+types/bookmarks";

// TODO: Import Form, Link, Outlet from "react-router"
// TODO: Import API helpers from "~/lib/api.server"
// TODO: Import Shadcn components (Card, Button, Input)

// ============================================
// LOADER: Fetch bookmarks from API
// Like BloC responding to LoadBookmarks event
// ============================================
export async function loader() {
  // TODO: Fetch and return bookmarks
  return { bookmarks: [] };
}

// ============================================
// ACTION: Handle form submissions
// Like BloC handling AddBookmark / DeleteBookmark events
// ============================================
export async function action({ request }: Route.ActionArgs) {
  // TODO: Get formData and intent
  // TODO: Handle "add" intent
  // TODO: Handle "delete" intent
  return null;
}

// ============================================
// COMPONENT: Render the UI
// Like Widget's build() method
// ============================================
export default function Bookmarks({ loaderData }: Route.ComponentProps) {
  const { bookmarks } = loaderData;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-4xl font-bold mb-8">QuickMarks</h1>

      {/* TODO: Add bookmark form */}

      {/* TODO: Bookmark list */}

      {/* TODO: <Outlet /> for nested route */}
    </div>
  );
}
