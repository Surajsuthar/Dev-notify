"use server";

import { db } from "@/lib/prisma";
import { Prisma, User } from "@prisma/client";

export const getUser = async (email: string): Promise<User | null> => {
  const user = await db.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    return null;
  }

  return user;
};

export const updateTelegramUsername = async (
  email: string,
  telegramUsername: string,
): Promise<User | null> => {
  try {
    console.log("Updating Telegram username for user:", email);
    const user = await db.user.update({
      where: {
        email: email,
      },
      data: {
        telegramUsername: telegramUsername,
      },
    });

    return user;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Error updating Telegram username:", error);
      return null;
    }
    throw error;
  }
};
