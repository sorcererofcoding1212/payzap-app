import { cn } from "@/lib/utils";
import { $Enums } from "@manvirsingh7/payzap-database/generated/prisma/client";

interface TransactionCardProps {
  amount: number;
  p2pTransactionType: string;
  status: $Enums.TransactionStatus;
  id: string;
}

export const TransactionCard = ({
  amount,
  p2pTransactionType,
  status,
  id,
}: TransactionCardProps) => {
  return (
    <div
      key={id}
      className={cn(
        "size-28 cursor-pointer rounded-md bg-base-200 shadow-md flex flex-col items-center justify-center",
        status === "Success"
          ? "border border-green-600"
          : status === "Failed"
          ? "border border-red-600"
          : "border border-base-content"
      )}
    >
      <div className="text-base-content font-semibold text-xl">₹{amount}</div>
      <div className="font-semibold mt-2 text-xs text-base-content">
        {p2pTransactionType === "CREDIT" ? "Recieved" : "Sent"}
      </div>
    </div>
  );
};
