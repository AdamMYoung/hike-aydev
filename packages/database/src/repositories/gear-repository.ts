"use server";

import { Prisma } from "@prisma/client";
import { prisma } from "../libs/db";
import { GearItemDTO, GearListDetailDTO, GearListDTO, GearListItemDTO } from "../types";

export const getUserGearLists = async (userId: string): Promise<GearListDTO[]> => {
  const gearLists = await prisma.gearList.findMany({
    where: {
      userId,
    },
  });

  return gearLists.map((list) => ({
    id: list.id,
    name: list.name,
    measurementType: list.measurementType,
  }));
};

export const getUserGearList = async (gearListId: string, userId?: string | null): Promise<GearListDetailDTO> => {
  const gearList = await prisma.gearList.findUnique({
    where: {
      id: gearListId,
    },
    include: {
      categories: {
        orderBy: { order: "asc" },
        include: { gearCategoryEntries: { orderBy: { order: "asc" }, include: { item: true } } },
      },
    },
  });

  if (!gearList) {
    throw new Error(`Cannot find gear list with ID ${gearListId}`);
  }

  if (gearList?.private && gearList.userId !== userId) {
    throw new Error("Cannot access another user's list flagged as private.");
  }

  return {
    id: gearList.id,
    name: gearList.name,
    measurementType: gearList.measurementType,
    categories: gearList.categories.map((category) => ({
      id: category.id,
      name: category.name,
      order: category.order,
      items: category.gearCategoryEntries.map((entry) => ({
        id: entry.id,
        itemId: entry.item.id,
        name: entry.item.name,
        order: entry.order,
        description: entry.item.description,
        quantity: entry.quantity,
        weight: entry.item.weightGrams,
        weightType: entry.weightType,
      })),
    })),
  };
};

export const getUserGearItems = async (userId: string): Promise<GearItemDTO[]> => {
  const gearItems = await prisma.gearItem.findMany({
    where: { userId },
  });

  return gearItems.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    weight: item.weightGrams,
  }));
};

export const deleteUserGearItem = async (userId: string, itemId: string): Promise<GearItemDTO> => {
  const gearItem = await prisma.gearItem.findFirst({
    where: { id: itemId, userId },
  });

  if (!gearItem) {
    throw new Error(`Cannot find gear item with ID ${itemId}`);
  }

  await prisma.gearItem.delete({ where: { id: itemId } });

  return {
    id: gearItem.id,
    name: gearItem.name,
    description: gearItem.description,
    weight: gearItem.weightGrams,
  };
};

export const createGearList = async (userId: string): Promise<GearListDTO> => {
  const gearList = await prisma.gearList.create({
    data: {
      userId,
    },
  });

  return {
    id: gearList.id,
    name: gearList.name,
    measurementType: gearList.measurementType,
  };
};

export const updateGearList = async (userId: string, data: GearListDetailDTO): Promise<GearListDetailDTO> => {
  const permissionCheck = await prisma.gearList.findFirst({
    where: { id: data.id },
  });

  if (!permissionCheck) {
    throw new Error(`Cannot find gear list with ID ${data.id}`);
  }

  if (permissionCheck.userId !== userId) {
    throw new Error("Cannot update another user's list.");
  }

  const flattenedItems = data.categories.reduce((prev, curr) => {
    return [...prev, ...curr.items.filter((item) => item.name || item.description)];
  }, [] as GearListItemDTO[]);

  const gearList = await prisma.$transaction(
    async (tx) => {
      await Promise.all(
        flattenedItems.map((item) =>
          tx.gearItem.upsert({
            where: { id: item.itemId },
            create: {
              id: item.itemId,
              name: item.name,
              description: item.description,
              weightGrams: item.weight,
              userId,
            },
            update: { name: item.name, description: item.description, weightGrams: item.weight },
          })
        )
      );

      await tx.gearList.delete({ where: { id: data.id } });

      return await tx.gearList.create({
        data: {
          id: data.id,
          userId: userId,
          name: data.name,
          measurementType: data.measurementType,
          categories: {
            create: data.categories.map((category, categoryIndex) => ({
              id: category.id,
              name: category.name,
              order: categoryIndex,
              gearCategoryEntries: {
                create: category.items
                  .filter((item) => item.name || item.description)
                  .map((item, itemIndex) => ({
                    order: itemIndex,
                    quantity: item.quantity,
                    weightType: item.weightType,
                    gearItemId: item.itemId,
                  })),
              },
            })),
          },
        },
        include: {
          categories: {
            orderBy: { order: "asc" },
            include: { gearCategoryEntries: { orderBy: { order: "asc" }, include: { item: true } } },
          },
        },
      });
    },
    {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      maxWait: 5000, // default: 2000
      timeout: 10000, // default: 5000
    }
  );

  if (!gearList) {
    throw new Error("Error updating gear list");
  }

  return {
    id: gearList.id,
    name: gearList.name,
    measurementType: gearList.measurementType,
    categories: gearList.categories.map((category) => ({
      id: category.id,
      name: category.name,
      order: category.order,
      items: category.gearCategoryEntries.map((entry) => ({
        id: entry.id,
        order: entry.order,
        itemId: entry.item.id,
        name: entry.item.name,
        description: entry.item.description,
        quantity: entry.quantity,
        weight: entry.item.weightGrams,
        weightType: entry.weightType,
      })),
    })),
  };
};

export const deleteGearList = async (userId: string, listId: string): Promise<GearListDTO> => {
  const gearList = await prisma.gearList.findUnique({
    where: { id: listId },
  });

  if (gearList === null) {
    throw new Error(`Cannot find gear list with ID ${listId}`);
  }

  if (gearList.userId !== userId) {
    throw new Error("Cannot delete another user's list.");
  }

  await prisma.gearList.delete({ where: { id: listId } });

  return {
    id: gearList.id,
    name: gearList.name,
    measurementType: gearList.measurementType,
  };
};
