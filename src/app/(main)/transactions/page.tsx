import { validateSession } from "@/actions/validateSession";
import { PageTitle } from "@/components/PageTitle";
import { TransactionHistory } from "@/features/transactions/components/TransactionHistory";
import React from "react";

const TransactionsPage = async () => {
  const session = await validateSession();
  return (
    <div className="px-2 lg:px-6">
      <PageTitle title="Transactions" />
      <div className="pt-8 lg:pt-10">
        <TransactionHistory />
      </div>
    </div>
  );
};

export default TransactionsPage;
