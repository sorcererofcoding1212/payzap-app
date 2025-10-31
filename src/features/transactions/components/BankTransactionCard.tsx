import { cn, OFFRAMP, ONRAMP } from "@/lib/utils";
import { $Enums } from "@manvirsingh7/payzap-database/generated/prisma/client";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";

interface BankTransactionCardProps {
  type: typeof ONRAMP | typeof OFFRAMP;
  id: string;
  status: $Enums.TransactionStatus;
  provider: string;
  amount: number;
  startTime: Date;
}

export const BankTransactionCard = ({
  type,
  id,
  status,
  provider,
  amount,
}: BankTransactionCardProps) => {
  return (
    <div key={id} className="flex items-center justify-between w-full">
      <div className="flex gap-x-3 lg:gap-x-4 items-center">
        <div
          className={cn(
            "bg-base-300 size-7 lg:size-9 rounded-full flex justify-center items-center p-2 lg:p-3",
            status === "Success"
              ? "border lg:border-2 border-green-500"
              : status === "Pending"
              ? "border lg:border-2 border-base-content"
              : "border lg:border-2 border-red-500"
          )}
        >
          {type === ONRAMP ? (
            <FaArrowRightLong className="text-base-content" />
          ) : (
            <FaArrowLeftLong className="text-base-content" />
          )}
        </div>
        <div className="w-[80%] min-w-[80%] flex items-start flex-col gap-y-1.5 lg:gap-y-2">
          <div className="text-base-content text-sm lg:text-base font-semibold">
            {type === ONRAMP ? `Recieved INR ${amount}` : `Sent INR ${amount}`}
          </div>
          <div className="text-base-content text-xs lg:text-sm">
            {type === ONRAMP ? `From ${provider}` : `To ${provider}`}
          </div>
        </div>
      </div>
      <div
        className={cn(
          "text-xs px-2 bg-base-300 py-2 lg:px-3 lg:py-2 rounded-md font-bold shadow-sm text-base-content min-w-18 text-center"
        )}
      >
        {status.toUpperCase()}
      </div>
    </div>
  );
};
