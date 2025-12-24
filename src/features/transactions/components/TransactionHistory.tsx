"use client";

import { DottedSeperator } from "@/components/DottedSeperator";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { P2PTransactionCard } from "./P2PTransactionCard";
import { BankTransactionCard } from "./BankTransactionCard";
import { useQuery } from "@tanstack/react-query";
import { getTransactions } from "../../../actions/getTransactions";
import { Skeleton } from "@/components/ui/skeleton";
import { useRef, useState } from "react";
import { TransactionAccountHistory } from "./TransactionAccountHistory";
import { InteractiveScrollArea } from "@/components/InteractiveScrollArea";

export const TransactionHistory = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: getTransactions,
    staleTime: 30_000,
  });

  const [counterPartyAccountId, setCounterPartyAccountId] =
    useState<string>("");

  const [counterPartyName, setCounterPartyName] = useState<string>("");

  const scrollRef = useRef<null | HTMLDivElement>(null);

  const scrollTowardsEnd = () => {
    scrollRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

  return (
    <Card className="lg:w-[50%] w-full text-center lg:text-left">
      <CardHeader>
        <CardTitle className="text-lg text-base-content">
          Transaction History
        </CardTitle>
      </CardHeader>
      <div className="px-6">
        <DottedSeperator color="silver" />
      </div>
      <div className="py-2">
        {isLoading || !data ? (
          <ScrollArea className="flex flex-col px-6 h-96">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex bg-base-100 h-17 lg:h-18 mb-2 lg:mb-3 border border-base-100 shadow-sm py-3 w-full items-center px-2 lg:px-4 rounded-md gap-x-3"
              >
                <Skeleton className="size-8 rounded-full" />

                <div className="flex flex-col flex-1 space-y-2">
                  <Skeleton className="h-4 w-[60%]" />
                  <Skeleton className="h-4 w-[40%]" />
                </div>

                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </ScrollArea>
        ) : (
          <>
            {counterPartyAccountId ? (
              <TransactionAccountHistory
                counterPartyAccountId={counterPartyAccountId}
                counterPartyName={counterPartyName}
                onClose={() => {
                  setCounterPartyAccountId("");
                }}
              />
            ) : (
              <>
                {data.length > 0 ? (
                  <InteractiveScrollArea
                    onClick={scrollTowardsEnd}
                    className="flex flex-col px-6 h-96"
                  >
                    {data.map((txn) => (
                      <div
                        key={txn.id}
                        className={cn(
                          "flex bg-base-100 cursor-pointer mb-3 border border-base-100 shadow-sm py-3 w-full items-center px-2 lg:px-4 rounded-md"
                        )}
                      >
                        {txn.type === "P2P" ? (
                          <P2PTransactionCard
                            onClick={() => {
                              if (
                                !txn.counterPartyAccountId ||
                                !txn.counterPartyName
                              )
                                return;

                              setCounterPartyAccountId(
                                txn.counterPartyAccountId
                              );
                              setCounterPartyName(txn.counterPartyName);
                            }}
                            id={txn.id}
                            counterPartyName={txn.counterPartyName}
                            amount={txn.amount}
                            p2pTransactionType={txn.p2pTransactionType}
                            status={txn.status}
                          />
                        ) : (
                          <BankTransactionCard
                            id={txn.id}
                            provider={txn.provider}
                            amount={txn.amount}
                            startTime={txn.startTime}
                            status={txn.status}
                            type={txn.type}
                          />
                        )}
                      </div>
                    ))}
                    <div className="h-2" ref={scrollRef}></div>
                  </InteractiveScrollArea>
                ) : (
                  <div className="h-56">
                    <div className="font-semibold mt-4 text-base-content text-center text-lg">
                      No transactions avaialble
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </Card>
  );
};
