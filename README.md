# QuickMarks Web App

React Router 7 web application for the Flutter to React Router workshop.

## Tech Stack

- **React Router 7.13** (Framework Mode) - Routing + data loading
- **React 19.2** - UI components
- **Tailwind CSS 4.1** - Styling (using new @theme syntax)
- **Shadcn/UI** - Component library
- **Conform 1.16 + Zod** - Form validation

## Setup

This app connects to the centralized QuickMarks API at `quickmarks-api.hello-b5e.workers.dev`.

1. **Copy environment file**
   ```bash
   cp .env.example .env
   ```

2. **Set your unique App ID**

   Edit `.env` and change `QUICKMARKS_APP_ID` to something unique (e.g., your name):
   ```
   QUICKMARKS_APP_ID=alice-workshop
   ```

   This ID scopes your bookmarks data in the shared API so you don't see other participants' data.

3. **Install dependencies**
   ```bash
   # From monorepo root
   npm install
   ```

4. **Start the dev server**
   ```bash
   npm run dev
   ```

   Open http://localhost:5173

## API Connection

The web app makes HTTP requests to `https://quickmarks-api.hello-b5e.workers.dev` with your unique `X-Quickmarks-App` header. Each participant's data is isolated by their App ID.

## Project Structure

```
app/
├── routes/              # Route files
│   ├── home.tsx         # Redirects to /bookmarks
│   ├── bookmarks.tsx    # Main bookmarks list (participants build this)
│   └── bookmark-detail.tsx # Bookmark detail (participants build this)
├── components/ui/       # Shadcn UI components
├── root.tsx             # Root layout
├── routes.ts            # Route configuration (config-based routing)
└── globals.css          # Tailwind CSS + theme

lib/
├── types.ts             # TypeScript types
├── api.server.ts        # API client for QuickMarks API
└── utils.ts             # Utility functions

.env                     # Your App ID configuration (not committed)
.env.example             # Template for environment variables
```

## Workshop Branches

- `start-state` - Empty route files (participants start here)
- `checkpoint-loader` - After Live Code #1
- `checkpoint-action` - After Live Code #2
- `solution` - Complete working app
- `solution-with-favorites` - With stretch goal
