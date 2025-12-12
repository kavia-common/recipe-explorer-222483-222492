/**
 * API client for the Recipe Explorer frontend.
 * Reads REACT_APP_BACKEND_URL, defaults to http://localhost:3001
 */
const BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

async function http(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    credentials: 'include',
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.headers.get('content-type')?.includes('application/json') ? res.json() : res.text();
}

// PUBLIC_INTERFACE
export async function getHealth() {
  /** Check backend health. */
  return http('/');
}

// PUBLIC_INTERFACE
export async function listCategories() {
  /** Fetch all categories. */
  return http('/categories/');
}

// PUBLIC_INTERFACE
export async function listRecipes(params = {}) {
  /** Fetch recipes with optional category filter. */
  const qs = new URLSearchParams(params).toString();
  return http(`/recipes/${qs ? `?${qs}` : ''}`);
}

// PUBLIC_INTERFACE
export async function searchRecipes(params = {}) {
  /** Search recipes by q and/or ingredients list (comma-separated). */
  const qs = new URLSearchParams(params).toString();
  return http(`/recipes/search/by${qs ? `?${qs}` : ''}`);
}
