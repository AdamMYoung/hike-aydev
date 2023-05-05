import { getServerSession } from "next-auth/next";

import { authOptions } from "./auth";

export type User = {
  name: string | null;
  email: string | null;
  image: string | null;
  id: string | null;
};

export async function getCurrentUser(): Promise<User> {
  const session = await getServerSession(authOptions);

  return session?.user as User;
}
