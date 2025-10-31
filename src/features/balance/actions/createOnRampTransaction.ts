"use server";

import { validateSession } from "@/actions/validateSession";
import { bankInstance } from "@/lib/axios";
import { prisma } from "@/lib/db";
import { generateTransactionId } from "@/lib/utils";

export const createOnRampTransaction = async (
  amount: number,
  provider: string
) => {
  try {
    const session = await validateSession();

    const transactionId = generateTransactionId(10);

    const response = await bankInstance.post("/api/transaction/token", {
      user_identifier: session.user.id,
      amount,
      provider,
      transactionId,
    });

    const { token } = response.data;

    const account = await prisma.account.findUnique({
      where: {
        userId: session.user.id,
      },

      select: {
        id: true,
      },
    });

    if (!account) {
      return {
        msg: "Invalid request",
        success: false,
      };
    }

    await prisma.onRampTransaction.create({
      data: {
        accountId: account.id,
        amount,
        provider,
        startTime: new Date(),
        status: "Pending",
        transactionId,
      },
    });

    return {
      msg: "Transaction initiated",
      token,
    };
  } catch {
    return {
      msg: "Internal server error",
      success: false,
    };
  }
};
