import {
  TooltipContent,
  Tooltip,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { $Enums } from "@manvirsingh7/payzap-database/generated/prisma/client";
import { FaArrowRightArrowLeft } from "react-icons/fa6";

interface P2PTransactionCardProps {
  id: string;
  status: $Enums.TransactionStatus;
  amount: number;
  p2pTransactionType: "CREDIT" | "DEBIT";
  counterPartyName?: string;
  onClick: () => void;
}

export const P2PTransactionCard = ({
  id,
  status,
  amount,
  p2pTransactionType,
  counterPartyName,
  onClick,
}: P2PTransactionCardProps) => {
  return (
    <Tooltip>
      <TooltipTrigger className="w-full cursor-pointer">
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
              <FaArrowRightArrowLeft className="text-base-content" />
            </div>
            <div className="w-[80%] min-w-[80%] flex items-start flex-col gap-y-1.5 lg:gap-y-2">
              <div className="text-base-content text-sm lg:text-base font-semibold">
                {p2pTransactionType === "CREDIT"
                  ? `Recieved INR ${amount}`
                  : `Sent INR ${amount}`}
              </div>
              <div
                onClick={onClick}
                className="text-base-content text-xs lg:text-sm lg:hover:underline lg:underline-offset-2"
              >
                {p2pTransactionType === "CREDIT"
                  ? `From ${counterPartyName}`
                  : `To ${counterPartyName}`}
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
        <TooltipContent>
          <p>Click on the account to view history</p>
        </TooltipContent>
      </TooltipTrigger>
    </Tooltip>
  );
};
