"use server";

import { getTransactions } from "@/actions/getTransactions";

export const getGroupedExpenses = async () => {
  const transactions = await getTransactions();

  if (transactions.length < 1) {
    return {
      data: [],
      success: false,
    };
  }

  const groupedData = transactions.reduce<Record<string, number>>(
    (acc, txn) => {
      if (
        txn.type === "OFFRAMP" ||
        (txn.type === "P2P" && txn.p2pTransactionType === "DEBIT")
      ) {
        acc[txn.type] = (acc[txn.type] || 0) + txn.amount;
      }
      return acc;
    },
    {}
  );

  const groupedTransactions = Object.entries(groupedData).map(
    ([type, amount]) => ({
      type,
      amount,
    })
  );

  return {
    data: groupedTransactions,
    success: true,
  };
};
