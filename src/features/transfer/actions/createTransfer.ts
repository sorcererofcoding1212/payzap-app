"use server";

import { notifyUser } from "@/actions/notifyUser";
import { validateSession } from "@/actions/validateSession";
import { prisma } from "@/lib/db";
import { adjustAmount } from "@/lib/utils";

export const createTransaction = async (amount: number, walletId: string) => {
  try {
    const session = await validateSession();

    if (adjustAmount(amount, "APPLICATION") < 50)
      throw new Error("Please enter an amount of at least ₹50.");

    if (adjustAmount(amount, "APPLICATION") > 10000)
      throw new Error("Amount exceeds the allowed limit of ₹10,000.");

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

      if (!sender || !reciever || !sender.balance || !reciever.balance)
        throw new Error("Account does not exist");

      if (!reciever.user.emailVerified) throw new Error("Email not verified");

      if (sender.walletId === walletId)
        throw new Error("Invalid transfer request");

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

        const transaction = await txn.p2PTransaction.create({
          data: {
            initiatedById: sender.id,
            initiatedToId: reciever.id,
            startTime: new Date(),
            status: "Success",
            amount,
          },
        });

        await txn.ledgerEntry.createMany({
          data: [
            {
              accountId: sender.id,
              amount: amount,
              type: "DEBIT",
              transactionId: transaction.id,
            },
            {
              accountId: reciever.id,
              amount: amount,
              type: "CREDIT",
              transactionId: transaction.id,
            },
          ],
        });

        return {
          msg: "Transaction Completed",
          transaction: {
            id: transaction.id,
            status: transaction.status,
            initiatedById: transaction.initiatedById,
            initiatedToId: transaction.initiatedToId,
            amount: transaction.amount,
          },
        };
      } else {
        const transaction = await txn.p2PTransaction.create({
          data: {
            initiatedById: sender.id,
            initiatedToId: reciever.id,
            startTime: new Date(),
            status: "Failed",
            amount,
          },
        });

        return {
          msg: "Insufficient Balance",
          transaction: {
            id: transaction.id,
            status: transaction.status,
            initiatedById: transaction.initiatedById,
            initiatedToId: transaction.initiatedToId,
            amount: transaction.amount,
          },
        };
      }
    });

    if (response.transaction.status === "Success") {
      await notifyUser(
        response.transaction.initiatedToId,
        response.transaction.initiatedById,
        response.transaction.amount
      );
      return {
        msg: response.msg,
        success: true,
      };
    } else {
      return {
        msg: response.msg,
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
