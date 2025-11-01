import { PrismaClient } from "@manvirsingh7/payzap-database/generated/prisma/client";
import path from "path";

declare global {
  var prisma: PrismaClient | undefined;
}

const enginePath = path.resolve(
  "node_modules/@manvirsingh7/payzap-database/generated/prisma/libquery_engine-rhel-openssl-3.0.x.so.node"
);

process.env.PRISMA_QUERY_ENGINE_LIBRARY = enginePath;

export const prisma =
  global.prisma ??
  new PrismaClient({
    log: ["query", "error"],
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
