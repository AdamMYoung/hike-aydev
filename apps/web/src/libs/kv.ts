import kv from "@vercel/kv";

export const getCachedEntry = async <T extends unknown>(key: string, req: () => Promise<T>) => {
  const stored = await kv.get<T>(key);

  if (stored) {
    return stored;
  }

  const request = await req();
  kv.set(key, request);

  return request;
};
