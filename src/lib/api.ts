const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL vantar í .env.local");
}

type FetchOptions = RequestInit & {
  token?: string;
};

export async function fetchApi<T>(
  path: string,
  options: FetchOptions = {},
): Promise<T> {
  const { token, headers, ...rest } = options;

  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers ?? {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`API villa: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export async function uploadImage(
  path: string,
  file: File,
  token?: string,
): Promise<unknown> {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Image upload villa: ${res.status}`);
  }

  return res.json();
}