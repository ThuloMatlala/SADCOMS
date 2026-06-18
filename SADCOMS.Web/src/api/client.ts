const BASE_URL = 'http://localhost:5195';

async function request<T>(path: string, options?: RequestInit): Promise<T> { 
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });


  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `HTTP ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) => request<T>(path, { 
    method: 'POST', 
    body: JSON.stringify(body) 
  }),
   put: <T>(path: string, body: unknown) => request<T>(path, { 
    method: 'PUT', 
    body: JSON.stringify(body) 
  }),
}