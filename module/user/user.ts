"use server";

import { db } from "@/lib/prisma";
import {  User } from "@prisma/client";
import { cache as reactCache } from "react";

export const getUser = reactCache(
  async (githubId: string): Promise<User | null> => {
    const user = await db.user.findUnique({
      where: {
        githubId: githubId,
      },
    });
    if (!user) {
      return null;
    }

    return user;
  },
);
