import type { Route } from "./+types/bookmark-detail";
import { Link } from "react-router";
import { getBookmark } from "~/lib/api.server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { ArrowLeft, ExternalLink } from "lucide-react";

// ============================================
// LOADER: Fetch single bookmark by ID
// ============================================
export async function loader({ params }: Route.LoaderArgs) {
  if (!params.id) {
    throw new Response("Not found", { status: 404 });
  }
  const bookmark = await getBookmark(params.id);
  if (!bookmark) {
    throw new Response("Not found", { status: 404 });
  }
  return { bookmark };
}

// ============================================
// COMPONENT: Bookmark detail view
// ============================================
export default function BookmarkDetail({ loaderData }: Route.ComponentProps) {
  const { bookmark } = loaderData;

  return (
    <Card className="mt-8">
      <CardHeader>
        <div className="flex items-center gap-4 mb-4">
          <Button asChild variant="ghost" size="sm">
            <Link to="/bookmarks">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to list
            </Link>
          </Button>
        </div>
        <CardTitle className="text-2xl">{bookmark.title}</CardTitle>
        <CardDescription>
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent inline-flex items-center gap-2 text-base"
          >
            {bookmark.url}
            <ExternalLink className="w-4 h-4" />
          </a>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <dl className="space-y-2 text-sm">
          <div>
            <dt className="font-medium text-muted-foreground">Created</dt>
            <dd>{new Date(bookmark.createdAt).toLocaleString()}</dd>
          </div>
          <div>
            <dt className="font-medium text-muted-foreground">ID</dt>
            <dd className="font-mono text-xs">{bookmark.id}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
