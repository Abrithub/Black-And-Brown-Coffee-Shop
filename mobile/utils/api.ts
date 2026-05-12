// Always use the Railway production backend
// Works for both local development (via network) and production
const BASE_URL = 'https://black-and-brown-coffee-shop-production.up.railway.app';

let userToken: string | null = null;
let adminToken: string | null = null;

export const setTokens = (user: string | null, admin: string | null) => {
  userToken = user;
  adminToken = admin;
};

const request = async (method: string, path: string, body?: object) => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = adminToken || userToken;
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
  return data;
};

export const api = {
  get: (path: string) => request('GET', path),
  post: (path: string, body: object) => request('POST', path, body),
  put: (path: string, body: object) => request('PUT', path, body),
  delete: (path: string) => request('DELETE', path),
};

export default api;
