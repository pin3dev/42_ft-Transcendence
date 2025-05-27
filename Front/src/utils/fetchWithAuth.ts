// fetchWithAuth.ts
import { getCookie } from './cookieUtils';

export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getCookie('jwt'); // Obtém o token do cookie
  console.log('Token JWT lido do cookie:', token); // Log para depuração

  const headers: Record<string, string> = { ...options.headers as Record<string, string> };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    console.warn('Token JWT ausente!');
  }

  return fetch(url, {
    ...options,
    headers,
  });
}