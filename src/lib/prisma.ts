import { PrismaClient } from "@prisma/client";

const prismSingletonClient = () => {
    return new PrismaClient({
        datasources: { db: { url: process.env.DATABASE_URL } }
    })
}

type TprismSingletonClient = ReturnType<typeof prismSingletonClient>

const globalForPrisma = globalThis as unknown as {
    prisma: TprismSingletonClient | undefined
}

export const db = globalForPrisma.prisma ?? prismSingletonClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;