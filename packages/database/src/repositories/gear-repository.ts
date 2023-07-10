"use server";

import { prisma } from "../libs/db";
import { GearListDTO } from "../types";

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
