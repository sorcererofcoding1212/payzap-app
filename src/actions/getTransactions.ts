"use server";

import { validateSession } from "@/actions/validateSession";
import { prisma } from "@/lib/db";
import { adjustAmount, OFFRAMP, ONRAMP, P2P } from "@/lib/utils";
import { Transaction } from "@/types/types";

export const getTransactions = async () => {
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

    if (!account) {
      throw new Error("Account does not exist");
    }

    const accountId = account.id;

    const p2pTransactions: Transaction[] = await prisma.p2PTransaction
      .findMany({
        where: {
          OR: [{ initiatedById: accountId }, { initiatedToId: accountId }],
        },
        select: {
          id: true,
          amount: true,
          startTime: true,
          initiatedBy: {
            select: {
              user: {
                select: {
                  name: true,
                  id: true,
                },
              },
              id: true,
            },
          },
          initiatedTo: {
            select: {
              user: {
                select: {
                  name: true,
                  id: true,
                },
              },
              id: true,
            },
          },
          status: true,
        },
      })
      .then((txns) => {
        return txns.map((txn) => {
          const isUserDebtor = txn.initiatedBy.user.id === session.user.id;
          return {
            type: P2P,
            p2pTransactionType: isUserDebtor ? "DEBIT" : "CREDIT",
            counterPartyName: isUserDebtor
              ? txn.initiatedTo.user.name
              : txn.initiatedBy.user.name,
            id: txn.id,
            amount: adjustAmount(txn.amount, "APPLICATION"),
            status: txn.status,
            startTime: txn.startTime,
            counterPartyId: isUserDebtor
              ? txn.initiatedTo.user.id
              : txn.initiatedBy.user.id,
            counterPartyAccountId: isUserDebtor
              ? txn.initiatedTo.id
              : txn.initiatedBy.id,
          };
        });
      });

    const offRampTransactions: Transaction[] = await prisma.offRampTransaction
      .findMany({
        where: {
          accountId,
        },

        select: {
          amount: true,
          status: true,
          startTime: true,
          provider: true,
          id: true,
        },
      })
      .then((txns) => {
        return txns.map((txn) => ({
          ...txn,
          amount: adjustAmount(txn.amount, "APPLICATION"),
          type: OFFRAMP,
        }));
      });

    const onRampTransactions: Transaction[] = await prisma.onRampTransaction
      .findMany({
        where: {
          accountId,
        },

        select: {
          amount: true,
          provider: true,
          startTime: true,
          id: true,
          status: true,
        },
      })
      .then((txns) => {
        return txns.map((txn) => ({
          ...txn,
          amount: adjustAmount(txn.amount, "APPLICATION"),
          type: ONRAMP,
        }));
      });

    const transactions = [
      ...p2pTransactions,
      ...offRampTransactions,
      ...onRampTransactions,
    ].sort((a, b) => b.startTime.getTime() - a.startTime.getTime());

    return transactions;
  } catch {
    return [];
  }
};
