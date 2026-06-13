import { brToast } from './toast';

export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function getAuthHeaders(): Record<string, string> {
  const stored = localStorage.getItem('brillance_auth');
  if (stored) {
    try {
      const { token } = JSON.parse(stored);
      if (token) return { 'Authorization': `Bearer ${token}` };
    } catch { /* ignore */ }
  }
  return {};
}

export async function api(path: string, options?: RequestInit): Promise<Response> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const detail = body.detail || res.statusText;

    if (res.status === 401) {
      // Token expired — clear session and redirect
      localStorage.removeItem('brillance_auth');
      window.location.href = '/login';
      throw new Error('Session expired');
    } else if (res.status === 403) brToast.error('Access denied', detail);
    else if (res.status === 404) brToast.error('Not found', detail);
    else if (res.status === 429) brToast.warning('Rate limit', 'Please wait before trying again');
    else if (res.status >= 500) brToast.error('Server error', 'Our team has been notified');
    else brToast.error('Request failed', detail);

    throw new Error(detail);
  }

  return res;
}

export async function apiJson<T = any>(path: string, options?: RequestInit): Promise<T> {
  const res = await api(path, options);
  return res.json();
}

export async function apiFormData<T = any>(path: string, formData: FormData): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
    },
    body: formData,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const detail = body.detail || res.statusText;
    if (res.status >= 500) brToast.error('Server error', 'File upload failed');
    else brToast.error('Upload failed', detail);
    throw new Error(detail);
  }

  return res.json();
}
