import { PrismaClient } from "@/app/generated/prisma/client";

// Prisma singleton — prevents connection storms in dev hot reload
// In production (serverless), each invocation may create a new instance,
// but the global guard prevents this in long-running dev processes.

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
