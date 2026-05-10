import { Platform } from 'react-native';

// On Android emulator, localhost = 10.0.2.2
// On physical device, use your machine's local IP e.g. 192.168.x.x:5000
// Use your PC's local IP so physical devices can reach the backend
const BASE_URL = 'http://192.168.1.2:5000';

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
