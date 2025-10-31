"use server";

import { validateSession } from "./validateSession";
import { prisma } from "@/lib/db";

export const checkAccountPinExists = async () => {
  try {
    const session = await validateSession();

    const userAccount = await prisma.account.findUnique({
      where: {
        userId: session.user.id,
      },

      select: {
        accountPin: true,
      },
    });

    if (!userAccount || !userAccount.accountPin) {
      return {
        msg: "Account PIN does not exist, please create a new one",
        success: false,
      };
    }

    return {
      msg: "Account PIN exist",
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
