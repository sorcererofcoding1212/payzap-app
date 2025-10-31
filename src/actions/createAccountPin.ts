"use server";

import { prisma } from "@/lib/db";
import { validateSession } from "./validateSession";
import bcrypt from "bcrypt";

export const createAccountPin = async (accountPin: string) => {
  try {
    const session = await validateSession();

    const encryptedAccountPin = await bcrypt.hash(accountPin, 10);

    await prisma.account.update({
      where: {
        userId: session.user.id,
      },

      data: {
        accountPin: encryptedAccountPin,
      },
    });

    return {
      msg: "Account PIN created",
      success: true,
    };
  } catch (error) {
    console.log(error);
    return {
      msg: "Internal server error",
      success: false,
    };
  }
};
