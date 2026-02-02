import type { Bookmark } from "./types";

// Workshop API - all participants connect to this shared API
const API_URL = "https://quickmarks.jayphen.com";

// Get your unique App ID from environment variable
// This scopes your data so you don't see other participants' bookmarks
const APP_ID = process.env.QUICKMARKS_APP_ID || "workshop-demo";

async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "X-Quickmarks-App": APP_ID,
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}

export async function getBookmarks(): Promise<Bookmark[]> {
  const response = await apiRequest<{ data: Bookmark[] }>("/bookmarks");
  return response.data;
}

export async function getBookmark(id: string): Promise<Bookmark | null> {
  try {
    const response = await apiRequest<{ data: Bookmark }>(`/bookmarks/${id}`);
    return response.data;
  } catch {
    return null;
  }
}

export async function addBookmark(
  bookmark: Omit<Bookmark, "id" | "createdAt">
): Promise<Bookmark> {
  const response = await apiRequest<{ data: Bookmark }>("/bookmarks", {
    method: "POST",
    body: JSON.stringify(bookmark),
  });
  return response.data;
}

export async function deleteBookmark(id: string): Promise<void> {
  await apiRequest<{ ok: boolean }>(`/bookmarks/${id}`, {
    method: "DELETE",
  });
}

export async function toggleFavorite(id: string): Promise<Bookmark> {
  const response = await apiRequest<{ data: Bookmark }>(`/bookmarks/${id}/favorite`, {
    method: "POST",
  });
  return response.data;
}
