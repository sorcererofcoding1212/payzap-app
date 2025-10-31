"use client";

import { useQuery } from "@tanstack/react-query";
import { getAccountTransactions } from "../actions/getAccountTransactions";
import { UserAvatar } from "@/components/UserAvatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, getTransactionDate, getTransactionTime, P2P } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { XIcon } from "lucide-react";
import { TransactionCard } from "./TransactionCard";

interface TransactionAccountHistoryProps {
  counterPartyAccountId: string;
  counterPartyName: string;
  onClose: () => void;
}

export const TransactionAccountHistory = ({
  counterPartyAccountId,
  counterPartyName,
  onClose,
}: TransactionAccountHistoryProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["account_transactions"],
    queryFn: () => getAccountTransactions(counterPartyAccountId),
    staleTime: 30_000,
  });
  return (
    <div className="px-3 lg:px-6 text-base-content">
      <div className="bg-base-300 py-2 lg:py-3 relative">
        <div className="flex justify-center">
          <UserAvatar name={counterPartyName} />
        </div>
        <div className="text-base-content mt-2 font-semibold text-center">
          {counterPartyName}
          <XIcon
            onClick={onClose}
            className="text-base-content/70 absolute top-2 right-3 size-4.5 lg:size-5 cursor-pointer"
          />
        </div>
      </div>
      <ScrollArea className="bg-base-100 text-center h-72 lg:h-56 px-3 lg:px-6">
        {isLoading || !data ? (
          <div className="flex flex-col gap-y-4 py-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-full flex justify-end">
                <Skeleton className="size-28"></Skeleton>
              </div>
            ))}
          </div>
        ) : (
          <>
            {data.map((txns, i) => {
              return (
                <div key={i}>
                  <div className="flex gap-x-2 flex-nowrap items-center py-3">
                    <Separator className="bg-base-content" />
                    <div className="text-[10px] lg:text-xs whitespace-nowrap">
                      {getTransactionDate(txns[0].startTime)}
                    </div>
                    <Separator className="bg-base-content" />
                  </div>
                  {txns.map((txn) => (
                    <div
                      key={txn.id}
                      className={cn(
                        "w-full mb-4 flex",
                        txn.type === P2P && txn.p2pTransactionType === "CREDIT"
                          ? "justify-start"
                          : "justify-end"
                      )}
                    >
                      {txn.p2pTransactionType === "CREDIT" ? (
                        <div className="flex gap-x-3 items-center">
                          <TransactionCard
                            status={txn.status}
                            amount={txn.amount}
                            p2pTransactionType={txn.p2pTransactionType}
                            id={txn.id}
                          />
                          <div className="text-base-content text-[10px] lg:text-xs">
                            {getTransactionTime(txn.startTime)}
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-x-3 items-center">
                          <div className="text-base-content text-[10px] lg:text-xs">
                            {getTransactionTime(txn.startTime)}
                          </div>
                          <TransactionCard
                            status={txn.status}
                            amount={txn.amount}
                            p2pTransactionType={txn.p2pTransactionType}
                            id={txn.id}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
          </>
        )}
      </ScrollArea>
    </div>
  );
};
