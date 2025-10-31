"use server";

import { getTransactions } from "@/actions/getTransactions";

export const getSortedTransactions = async () => {
  const transactions = await getTransactions();

  if (transactions.length < 1) {
    return {
      data: [],
      success: false,
    };
  }

  const groupedTransactions = transactions.reduce<
    Record<string, { income: number; expense: number }>
  >((acc, txn) => {
    const dateKey = txn.startTime.toISOString().split("T")[0];
    if (!acc[dateKey]) acc[dateKey] = { income: 0, expense: 0 };

    if (txn.type === "P2P" && txn.p2pTransactionType === "DEBIT") {
      acc[dateKey].expense += txn.amount;
    } else {
      acc[dateKey].income += txn.amount;
    }

    return acc;
  }, {});

  const volumeHistory = Object.keys(groupedTransactions)
    .map((date) => {
      const { income, expense } = groupedTransactions[date];
      return {
        date: new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        income,
        expense,
        volume: income + expense,
      };
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return {
    success: true,
    data: volumeHistory,
  };
};
