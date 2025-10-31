"use server";

import { prisma } from "@/lib/db";

export const publishUserBalanceUpdate = async (
  accountId: string,
  balance: number
) => {
  try {
    await prisma.balanceHistory.create({
      data: {
        accountId,
        balance,
      },
    });
    return {
      success: true,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
    };
  }
};
