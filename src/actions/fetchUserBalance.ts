"use server";

import { prisma } from "@/lib/db";
import { validateSession } from "./validateSession";
import { adjustAmount } from "@/lib/utils";

export const fetchUserBalance = async () => {
  try {
    const session = await validateSession();

    const accountBalance = await prisma.account.findUnique({
      where: {
        userId: session.user.id,
      },

      select: {
        balance: {
          select: {
            locked: true,
            amount: true,
          },
        },
      },
    });

    if (!accountBalance || !accountBalance.balance) {
      return {
        msg: "Invalid request",
        success: false,
      };
    }

    const userBalance = {
      amount: adjustAmount(accountBalance.balance.amount, "APPLICATION"),
      locked: adjustAmount(accountBalance.balance.locked, "APPLICATION"),
    };

    return {
      msg: "Balance fetched",
      success: true,
      balance: userBalance,
    };
  } catch (error) {
    console.log(error);
    return {
      msg: "Internal server error",
      success: false,
    };
  }
};
