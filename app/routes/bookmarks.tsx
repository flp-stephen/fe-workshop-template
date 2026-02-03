import type { Route } from "./+types/bookmarks";
import { Form, useActionData, Link, Outlet } from "react-router";
import { getBookmarks, addBookmark, deleteBookmark, toggleFavorite } from "~/lib/api.server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Bookmark, ExternalLink, Trash2, Star } from "lucide-react";

// ============================================
// LOADER: Fetch bookmarks from API
// ============================================
export async function loader() {
  const bookmarks = await getBookmarks();
  // Sort favorites to the top
  const sorted = bookmarks.sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    return 0;
  });
  return { bookmarks: sorted };
}

// ============================================
// ACTION: Handle add/delete/favorite
// ============================================
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "add") {
    const title = formData.get("title") as string;
    const url = formData.get("url") as string;

    // Validate
    const errors: { title?: string; url?: string } = {};
    if (!title || title.trim() === "") {
      errors.title = "Title is required";
    }
    if (!url || url.trim() === "") {
      errors.url = "Please enter a valid URL";
    } else {
      try {
        new URL(url);
      } catch {
        errors.url = "Please enter a valid URL";
      }
    }

    if (Object.keys(errors).length > 0) {
      return { errors, values: { title, url } };
    }

    await addBookmark({ title: title.trim(), url: url.trim() });
    return { success: true };
  }

  if (intent === "delete") {
    const id = formData.get("id") as string;
    if (id) {
      await deleteBookmark(id);
    }
  }

  if (intent === "favorite") {
    const id = formData.get("id") as string;
    if (id) {
      await toggleFavorite(id);
    }
  }

  return null;
}

// ============================================
// COMPONENT: Render the UI
// ============================================
export default function Bookmarks({ loaderData }: Route.ComponentProps) {
  const { bookmarks } = loaderData;
  const actionData = useActionData<typeof action>();

  // Extract errors and previous values from action data
  const errors = actionData && "errors" in actionData ? actionData.errors : null;
  const values = actionData && "values" in actionData ? actionData.values : null;

  // Use bookmarks length as key to reset form when a new bookmark is added
  const formKey = `form-${bookmarks.length}`;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-4xl font-bold mb-8">QuickMarks</h1>

      {/* Add Bookmark Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add New Bookmark</CardTitle>
        </CardHeader>
        <CardContent>
          <Form key={formKey} method="post" className="space-y-4">
            <input type="hidden" name="intent" value="add" />
            <div>
              <label htmlFor="title" className="text-sm font-medium block mb-1">
                Title
              </label>
              <Input
                id="title"
                name="title"
                type="text"
                placeholder="My favorite resource"
                defaultValue={errors ? values?.title : ""}
              />
              {errors?.title && (
                <p className="text-sm text-destructive mt-1">{errors.title}</p>
              )}
            </div>
            <div>
              <label htmlFor="url" className="text-sm font-medium block mb-1">
                URL
              </label>
              <Input
                id="url"
                name="url"
                type="text"
                placeholder="https://example.com"
                defaultValue={errors ? values?.url : ""}
              />
              {errors?.url && (
                <p className="text-sm text-destructive mt-1">{errors.url}</p>
              )}
            </div>
            <Button type="submit" className="w-full">
              Save Bookmark
            </Button>
          </Form>
        </CardContent>
      </Card>

      {/* Bookmark List */}
      {bookmarks.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">
          No bookmarks yet. Add one above!
        </p>
      ) : (
        <ul className="space-y-3">
          {bookmarks.map((bookmark) => (
            <li key={bookmark.id}>
              <Card>
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
                  <Form method="post">
                    <input type="hidden" name="intent" value="favorite" />
                    <input type="hidden" name="id" value={bookmark.id} />
                    <Button
                      type="submit"
                      variant="ghost"
                      size="icon"
                      className={bookmark.isFavorite ? "text-yellow-500 hover:text-yellow-600" : "text-muted-foreground hover:text-yellow-500"}
                    >
                      <Star className={`w-4 h-4 ${bookmark.isFavorite ? "fill-current" : ""}`} />
                      <span className="sr-only">Toggle favorite</span>
                    </Button>
                  </Form>
                  <Form method="post">
                    <input type="hidden" name="intent" value="delete" />
                    <input type="hidden" name="id" value={bookmark.id} />
                    <Button
                      type="submit"
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="sr-only">Delete bookmark</span>
                    </Button>
                  </Form>
                </CardHeader>
              </Card>
            </li>
          ))}
        </ul>
      )}

      {/* Nested Route Outlet */}
      <Outlet />
    </div>
  );
}
