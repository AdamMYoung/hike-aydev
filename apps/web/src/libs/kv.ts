import kv from "@vercel/kv";

export const getCachedEntry = async <T extends unknown>(key: string, req: () => Promise<T>) => {
  if (process.env.VERCEL_ENV !== "production") {
    return req();
  }

  const stored = await kv.get<T>(key);

  if (stored) {
    return stored;
  }

  const request = await req();
  await kv.set(key, request, { ex: 3600 });

  return request;
};
