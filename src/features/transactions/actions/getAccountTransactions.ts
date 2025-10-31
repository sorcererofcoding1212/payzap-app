"use server";

import { validateSession } from "@/actions/validateSession";
import { prisma } from "@/lib/db";
import { adjustAmount, getTransactionDate, P2P } from "@/lib/utils";

export const getAccountTransactions = async (counterPartyAccountId: string) => {
  try {
    const session = await validateSession();
    const account = await prisma.account.findUnique({
      where: {
        userId: session.user.id,
      },

      select: {
        id: true,
      },
    });

    if (!account) throw new Error("Account does not exist");

    const accountId = account.id;

    const transactions = await prisma.p2PTransaction
      .findMany({
        where: {
          OR: [
            {
              initiatedById: counterPartyAccountId,
              initiatedToId: accountId,
            },
            { initiatedById: accountId, initiatedToId: counterPartyAccountId },
          ],
        },

        select: {
          id: true,
          amount: true,
          status: true,
          startTime: true,
          initiatedBy: {
            select: {
              user: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      })
      .then((txns) => {
        return txns.map((txn) => {
          const isUserDebtor = txn.initiatedBy.user.id === session.user.id;
          return {
            ...txn,
            amount: adjustAmount(txn.amount, "APPLICATION"),
            type: P2P,
            p2pTransactionType: isUserDebtor ? "DEBIT" : "CREDIT",
          };
        });
      })
      .then((txns) =>
        [...new Set(txns.map((txn) => getTransactionDate(txn.startTime)))].map(
          (txnDate) =>
            txns.filter((txn) => getTransactionDate(txn.startTime) === txnDate)
        )
      );

    return transactions;
  } catch (error) {
    console.log(error);
    return [];
  }
};
