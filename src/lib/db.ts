import { PrismaClient } from "@manvirsingh7/payzap-database/generated/prisma/client";
import path from "path";

declare global {
  var prisma: PrismaClient | undefined;
}

const enginePath =
  process.env.NODE_ENV === "production"
    ? path.join(
        process.cwd(),
        "node_modules/@manvirsingh7/payzap-database/generated/prisma/libquery_engine-debian-openssl-3.0.x.so.node"
      )
    : path.join(
        process.cwd(),
        "node_modules/@manvirsingh7/payzap-database/generated/prisma/query_engine-windows.dll.node"
      );

process.env.PRISMA_QUERY_ENGINE_LIBRARY = enginePath;

export const prisma =
  global.prisma ??
  new PrismaClient({
    log: ["query", "error"],
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
