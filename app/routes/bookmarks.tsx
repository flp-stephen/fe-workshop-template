import type { Route } from "./+types/bookmarks";
import { Form, useActionData, Link, Outlet } from "react-router";
import { getBookmarks, addBookmark, deleteBookmark } from "~/lib/api.server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Bookmark, ExternalLink, Trash2 } from "lucide-react";
import { useForm, getFormProps, getInputProps } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { z } from "zod";

const addBookmarkSchema = z.object({
  intent: z.literal("add"),
  title: z.string().min(1, "Title is required"),
  url: z.string().url("Please enter a valid URL"),
});

const deleteBookmarkSchema = z.object({
  intent: z.literal("delete"),
  id: z.string().min(1, "Bookmark ID is required"),
});

// ============================================
// LOADER: Fetch bookmarks from API
// ============================================
export async function loader() {
  const bookmarks = await getBookmarks();
  return { bookmarks };
}

// ============================================
// ACTION: Handle add/delete
// ============================================
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "add") {
    const submission = parseWithZod(formData, { schema: addBookmarkSchema });
    if (submission.status !== "success") {
      return submission.reply();
    }
    await addBookmark({
      title: submission.value.title,
      url: submission.value.url,
    });
  }

  if (intent === "delete") {
    const submission = parseWithZod(formData, { schema: deleteBookmarkSchema });
    if (submission.status !== "success") {
      return submission.reply();
    }
    await deleteBookmark(submission.value.id);
  }

  return null;
}

// ============================================
// COMPONENT: Render the UI
// ============================================
export default function Bookmarks({ loaderData }: Route.ComponentProps) {
  const { bookmarks } = loaderData;
  const lastResult = useActionData<typeof action>();

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: addBookmarkSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-4xl font-bold mb-8">QuickMarks</h1>

      {/* Add Bookmark Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add New Bookmark</CardTitle>
        </CardHeader>
        <CardContent>
          <Form method="post" {...getFormProps(form)} className="space-y-4">
            <input type="hidden" name="intent" value="add" />
            <div>
              <label htmlFor={fields.title.id} className="text-sm font-medium block mb-1">
                Title
              </label>
              <Input
                {...getInputProps(fields.title, { type: "text" })}
                placeholder="My favorite resource"
              />
              {fields.title.errors && (
                <p className="text-sm text-destructive mt-1">{fields.title.errors}</p>
              )}
            </div>
            <div>
              <label htmlFor={fields.url.id} className="text-sm font-medium block mb-1">
                URL
              </label>
              <Input
                {...getInputProps(fields.url, { type: "url" })}
                placeholder="https://example.com"
              />
              {fields.url.errors && (
                <p className="text-sm text-destructive mt-1">{fields.url.errors}</p>
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
          ))}
        </ul>
      )}

      {/* Nested Route Outlet */}
      <Outlet />
    </div>
  );
}
