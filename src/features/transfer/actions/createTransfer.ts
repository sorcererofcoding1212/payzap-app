"use server";

import { notifyUser } from "@/actions/notifyUser";
import { validateSession } from "@/actions/validateSession";
import { prisma } from "@/lib/db";
import { adjustAmount } from "@/lib/utils";
import { errorMessage } from "../lib/errorMessages";

export const createTransfer = async (amount: number, walletId: string) => {
  try {
    const session = await validateSession();

    if (adjustAmount(amount, "APPLICATION") < 50)
      throw new Error(errorMessage.MIN_LIMIT);

    if (adjustAmount(amount, "APPLICATION") > 10000)
      throw new Error(errorMessage.MAX_LIMIT);

    const sender = await prisma.account.findUnique({
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
        user: {
          select: {
            emailVerified: true,
          },
        },
      },
    });

    const reciever = await prisma.account.findUnique({
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

    const response = await prisma.$transaction(async (txn) => {
      if (!sender || !reciever || !sender.balance || !reciever.balance)
        throw new Error(errorMessage.ACCOUNT_NOT_FOUND);

      if (!sender.user.emailVerified || !reciever.user.emailVerified)
        throw new Error(errorMessage.EMAIL_NOT_VERIFIED);

      if (sender.walletId === walletId)
        throw new Error(errorMessage.INVALID_REQUEST);

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
              createdAt: transaction.startTime,
            },
            {
              accountId: reciever.id,
              amount: amount,
              type: "CREDIT",
              transactionId: transaction.id,
              createdAt: transaction.startTime,
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
      const notificationContent = `Received INR ${adjustAmount(
        amount,
        "APPLICATION"
      )} from ${session.user.name}`;

      const notification = await prisma.notification.create({
        data: {
          accountId: response.transaction.initiatedToId,
          type: "AmountReceived",
          content: notificationContent,
          amount,
        },

        select: {
          account: {
            select: {
              userId: true,
            },
          },
        },
      });

      await notifyUser(notificationContent, notification.account.userId);
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
    const expectedErrors = [
      errorMessage.ACCOUNT_NOT_FOUND,
      errorMessage.EMAIL_NOT_VERIFIED,
      errorMessage.INVALID_REQUEST,
      errorMessage.MIN_LIMIT,
      errorMessage.MAX_LIMIT,
    ];

    if (!expectedErrors.includes(error.message)) {
      return {
        msg: errorMessage.SERVER_ERROR,
        success: false,
      };
    }

    return {
      msg: error.message || errorMessage.SERVER_ERROR,
      success: false,
    };
  }
};
