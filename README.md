# QuickMarks - React Router 7 Workshop

Welcome to the Flutter to React Router workshop. This is your starting project for building a bookmark manager with React Router 7.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file and set your unique App ID
cp .env.example .env
# Edit .env and change QUICKMARKS_APP_ID to your name (e.g., alice-workshop)

# 3. Start development server
npm run dev
```

Open http://localhost:5173 to see your app.

## Your App ID

Edit `.env` and set `QUICKMARKS_APP_ID` to something unique (e.g., your name):

```
QUICKMARKS_APP_ID=alice-workshop
```

This ID scopes your bookmarks in the shared API so you only see your own data.

## Tech Stack

- **React Router 7.13** (Framework Mode) - Routing + data loading
- **React 19.2** - UI components
- **Tailwind CSS 4.1** - Styling
- **Shadcn/UI** - Component library

## Project Structure

```
app/
├── routes/              # Route files (you'll build these!)
│   ├── home.tsx         # Redirects to /bookmarks
│   ├── bookmarks.tsx    # Main bookmarks list
│   └── bookmark-detail.tsx # Bookmark detail view
├── components/ui/       # Pre-built Shadcn UI components
├── root.tsx             # Root layout
├── routes.ts            # Route configuration
└── globals.css          # Styles

lib/
├── types.ts             # TypeScript types
├── api.server.ts        # API client (pre-built for you)
└── utils.ts             # Utility functions
```

## API Client

The API client in `app/lib/api.server.ts` is pre-built for you. Import and use these functions in your loaders and actions:

```ts
import { getBookmarks, getBookmark, addBookmark, deleteBookmark } from "~/lib/api.server";
```

### Available Functions

```ts
// Get all bookmarks
const bookmarks = await getBookmarks();
// Returns: Bookmark[]

// Get a single bookmark by ID
const bookmark = await getBookmark("abc123");
// Returns: Bookmark | null

// Add a new bookmark
const newBookmark = await addBookmark({ title: "Example", url: "https://example.com" });
// Returns: Bookmark

// Delete a bookmark
await deleteBookmark("abc123");
// Returns: void
```

### Bookmark Type

```ts
interface Bookmark {
  id: string;
  title: string;
  url: string;
  createdAt: string;
  isFavorite?: boolean;
}
```

## Falling Behind?

If you get stuck, you can checkout a checkpoint branch:

```bash
# After Live Code #1 (loader + list)
git checkout checkpoint-loader

# After Live Code #2 (action + form)
git checkout checkpoint-action

# Complete working app
git checkout solution

# With stretch goal (favorites)
git checkout solution-with-favorites
```

## API Reference

The app connects to `https://quickmarks.jayphen.com`. See the [API docs](https://quickmarks.jayphen.com/docs) for details.
