"use server";

import { validateSession } from "@/actions/validateSession";
import { bankInstance } from "@/lib/axios";
import { prisma } from "@/lib/db";

export const createOffRampTransaction = async (
  amount: number,
  accountNumber: string,
  bank: string
) => {
  try {
    const session = await validateSession();

    const account = await prisma.account.findUnique({
      where: {
        userId: session.user.id,
      },

      select: {
        id: true,
        balance: {
          select: {
            amount: true,
            id: true,
          },
        },
      },
    });

    if (!account || !account.balance) {
      throw new Error("Invalid request");
    }

    const balanceId = account.balance.id;

    const availableBalance = account.balance.amount >= amount;

    if (!availableBalance) {
      throw new Error("Insufficient funds");
    }

    const transaction = await prisma.$transaction(async (txn) => {
      await txn.balance.update({
        where: {
          id: balanceId,
        },

        data: {
          amount: {
            decrement: amount,
          },
          locked: {
            increment: amount,
          },
        },
      });

      return txn.offRampTransaction.create({
        data: {
          accountId: account.id,
          startTime: new Date(),
          status: "Pending",
          amount,
          provider: bank,
        },
      });
    });

    const response = await bankInstance.post("/api/transfer", {
      amount,
      accountNumber,
    });

    if (response.data.success) {
      await prisma.$transaction(async (txn) => {
        const updatedBalance = await txn.balance.update({
          where: {
            id: balanceId,
          },

          data: {
            locked: {
              decrement: amount,
            },
          },
        });

        await txn.offRampTransaction.update({
          where: {
            id: transaction.id,
          },
          data: {
            status: "Success",
          },
        });

        await txn.balanceHistory.create({
          data: {
            accountId: account.id,
            balance: updatedBalance.amount,
          },
        });
      });

      return {
        msg: "Transfer completed",
        success: true,
      };
    } else {
      await prisma.$transaction(async (txn) => {
        await txn.offRampTransaction.update({
          where: {
            id: transaction.id,
          },
          data: {
            status: "Failed",
          },
        });

        await txn.balance.update({
          where: {
            id: balanceId,
          },
          data: {
            amount: {
              increment: amount,
            },
            locked: {
              decrement: amount,
            },
          },
        });
      });

      return {
        msg: "Transfer failed",
        success: false,
      };
    }
  } catch (error: any) {
    console.log(error);
    return {
      msg: error.message || "Internal server error",
      success: false,
    };
  }
};
