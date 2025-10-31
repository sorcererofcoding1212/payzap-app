"use server";

import { notifyUser } from "@/actions/notifyUser";
import { validateSession } from "@/actions/validateSession";
import { prisma } from "@/lib/db";

export const createTransaction = async (amount: number, walletId: string) => {
  try {
    const session = await validateSession();

    const response = await prisma.$transaction(async (txn) => {
      const sender = await txn.account.findUnique({
        where: {
          userId: session.user.id,
        },

        select: {
          balance: {
            select: {
              amount: true,
              id: true,
            },
          },
          walletId: true,
          id: true,
        },
      });

      const reciever = await txn.account.findUnique({
        where: {
          walletId,
        },

        select: {
          id: true,
          balance: {
            select: {
              id: true,
            },
          },
          user: {
            select: {
              emailVerified: true,
            },
          },
        },
      });

      if (
        !sender ||
        !reciever ||
        !sender.balance ||
        !reciever.balance ||
        !reciever.user.emailVerified
      ) {
        throw new Error("Account does not exist");
      }

      if (sender.walletId === walletId) {
        throw new Error("Invalid transfer request");
      }

      const availableBalance = sender.balance.amount >= amount;

      if (availableBalance) {
        const senderBalance = await txn.balance.update({
          where: {
            id: sender.balance.id,
          },

          data: {
            amount: {
              decrement: amount,
            },
          },

          select: {
            amount: true,
          },
        });

        const recieverBalance = await txn.balance.update({
          where: {
            id: reciever.balance.id,
          },

          data: {
            amount: {
              increment: amount,
            },
          },
        });

        await txn.balanceHistory.create({
          data: { accountId: sender.id, balance: senderBalance.amount },
        });

        await txn.balanceHistory.create({
          data: { accountId: reciever.id, balance: recieverBalance.amount },
        });

        return await txn.p2PTransaction.create({
          data: {
            initiatedById: sender.id,
            initiatedToId: reciever.id,
            startTime: new Date(),
            status: "Success",
            amount,
          },
        });
      } else {
        return await txn.p2PTransaction.create({
          data: {
            initiatedById: sender.id,
            initiatedToId: reciever.id,
            startTime: new Date(),
            status: "Failed",
            amount,
          },
        });
      }
    });

    if (response.status === "Success") {
      await notifyUser(
        response.initiatedToId,
        response.initiatedById,
        response.amount
      );
      return {
        msg: "Transaction completed",
        success: true,
      };
    } else {
      return {
        msg: "Transaction Failed",
        success: false,
      };
    }
  } catch (error: any) {
    return {
      msg: error.message || "Internal server error",
      success: false,
    };
  }
};
