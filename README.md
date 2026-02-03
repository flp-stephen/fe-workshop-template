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

The app connects to `https://quickmarks-api.hello-b5e.workers.dev`. See the [API docs](https://quickmarks-api.hello-b5e.workers.dev/docs) for details.
