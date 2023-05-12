"use server";

import { clearCachedEntry, getCachedEntry } from "../libs/cache";
import { prisma } from "../libs/db";
import { UserDTO } from "../types";

const clearProfileCache = async (userId: string, providerIds: string[]) => {
  return Promise.all([
    clearCachedEntry(`get-user-by-id-${userId}`),
    ...providerIds.map((id) => clearCachedEntry(`get-user-by-provider-id-${id}`)),
  ]);
};

export const getUserById = (userId: string): Promise<UserDTO> => {
  return getCachedEntry(`get-user-by-id-${userId}`, async () => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true, image: true },
    });

    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }

    return {
      name: user.name ?? "",
      email: user.email ?? "",
      image: user.image,
    };
  });
};

export const getUserByProviderId = (providerId: string): Promise<UserDTO> => {
  return getCachedEntry(`get-user-by-provider-id-${providerId}`, async () => {
    const account = await prisma.account.findUnique({
      where: { id: providerId },
      select: { user: { select: { name: true, email: true, image: true } } },
    });

    if (!account) {
      throw new Error(`Account with provider id ${providerId} not found`);
    }

    return {
      name: account.user.name ?? "",
      email: account.user.email ?? "",
      image: account.user.image,
    };
  });
};

export const getUserProviderType = (providerId: string): Promise<string> => {
  return getCachedEntry(`get-user-provider-type-${providerId}`, async () => {
    const account = await prisma.account.findUnique({
      where: { id: providerId },
      select: { provider: true },
    });

    if (!account) {
      throw new Error(`Account with provider id ${providerId} not found`);
    }

    return account.provider;
  });
};

export const getUserStravaLinkStatus = (userId?: string | null): Promise<boolean> => {
  if (!userId) {
    return Promise.resolve(false);
  }

  return getCachedEntry(`get-user-strava-link-status-${userId}`, async () => {
    const user = await prisma.user.findFirst({
      where: { id: userId },
      select: { account: { select: { provider: true } } },
    });

    return !!user?.account.find((acc) => acc.provider === "strava");
  });
};

export const updateUser = async (userId: string, data: Partial<UserDTO>): Promise<UserDTO> => {
  const user = await prisma.user.update({
    where: { id: userId },
    data,
    select: { name: true, email: true, image: true, account: true },
  });

  await clearProfileCache(
    userId,
    user.account.map((acc) => acc.id)
  );

  return {
    name: user.name ?? "",
    email: user.email ?? "",
    image: user.image,
  };
};

export const deleteUser = async (userId: string): Promise<UserDTO> => {
  const user = await prisma.user.delete({
    where: { id: userId },
    include: { account: { select: { id: true } } },
  });

  await clearProfileCache(
    userId,
    user.account.map((acc) => acc.id)
  );

  return {
    name: user.name ?? "",
    email: user.email ?? "",
    image: user.image,
  };
};
