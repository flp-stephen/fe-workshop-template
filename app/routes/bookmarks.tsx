import type { Route } from "./+types/bookmarks";
import { Link, Outlet } from "react-router";
import { getBookmarks } from "~/lib/api.server";
import { Card, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Bookmark, ExternalLink } from "lucide-react";

// ============================================
// LOADER: Fetch bookmarks from API
// Like BloC responding to LoadBookmarks event
// ============================================
export async function loader() {
  const bookmarks = await getBookmarks();
  return { bookmarks };
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

      {/* Bookmark List */}
      {bookmarks.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">
          No bookmarks yet. Add one above!
        </p>
      ) : (
        <ul className="space-y-3">
          {bookmarks.map((bookmark: any) => (
            <Card key={bookmark.id}>
              <CardHeader className="flex-row items-center gap-4 space-y-0">
                <Bookmark className="w-5 h-5 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base">
                    <Link to={`/bookmarks/${bookmark.id}`} className="hover:text-primary">
                      {bookmark.title}
                    </Link>
                  </CardTitle>
                  <CardDescription>
                    <a
                      href={bookmark.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-accent inline-flex items-center gap-1"
                    >
                      {bookmark.url}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </CardDescription>
                </div>
                {/* TODO: Delete button */}
              </CardHeader>
            </Card>
          ))}
        </ul>
      )}

      {/* Nested Route Outlet */}
      <Outlet />
    </div>
  );
}
