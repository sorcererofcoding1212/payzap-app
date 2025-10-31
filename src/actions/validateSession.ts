"use server";

import { AUTH_OPTIONS } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const validateSession = async () => {
  const session = await getServerSession(AUTH_OPTIONS);

  if (!session?.user) {
    redirect("/signin");
  }

  return session;
};
