const base = process.env.NEXT_PUBLIC_API_BASE!;
export async function api<T>(path: string, init?: RequestInit) {
  const res = await fetch(`${base}${path}`, { ...init, headers: { 'Content-Type': 'application/json', ...(init?.headers||{}) } });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
}
