const API_URL = process.env.BEDS24_API_URL_JSON?.replace(/\/$/, "") || "https://api.beds24.com/json";

async function fetchBeds24<T = any>(endpoint: string, body: any = {}): Promise<T> {
  const token = process.env.BEDS24_API_TOKEN;
  if (!token) return [] as unknown as T;
  const res = await fetch(`${API_URL}/${endpoint.replace(/^\//, "")}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body || {}),
    cache: "no-store",
  });
  if (!res.ok) return [] as unknown as T;
  try {
    return (await res.json()) as T;
  } catch {
    return [] as unknown as T;
  }
}

export async function getProperties(): Promise<any[]> {
  const data = await fetchBeds24<any>("getProperties");
  if (Array.isArray(data)) return data;
  const arr = (data as any)?.items ?? (data as any)?.data ?? (data as any)?.properties ?? (data as any)?.result;
  return Array.isArray(arr) ? arr : [];
}

export async function getProperty(propertyId: string | number): Promise<any> {
  return fetchBeds24<any>("getProperty", { propertyId });
}

export async function getInventory(propertyId: string | number): Promise<any> {
  return fetchBeds24<any>("getInventory", { propertyId });
}


