"use client";

import { checkAccountPinExists } from "@/actions/checkAccountPinExists";
import { fetchUserBalance } from "@/actions/fetchUserBalance";
import { CreatePinModal } from "@/components/CreatePinModal";
import { PinModal } from "@/components/PinModal";
import { Card, CardContent } from "@/components/ui/card";
import { useAccountStore } from "@/store/accountStore";
import { useEffect, useState } from "react";
import { MdOutlineArrowCircleRight } from "react-icons/md";
import { toast } from "sonner";

export const MobileBalanceViewer = () => {
  const [showPinModal, setShowPinModal] = useState<boolean>(false);
  const [showCreatePinModal, setShowCreatePinModal] = useState<boolean>(false);
  const { pinVerified, setPinVerified } = useAccountStore();
  const [balance, setBalance] = useState<number>();

  const getUserBalance = async () => {
    const response = await fetchUserBalance();

    if (!response.success) {
      console.log(response.msg);
      return;
    } else if (response.balance) {
      setBalance(response.balance.amount);
    }
  };

  useEffect(() => {
    if (pinVerified) {
      getUserBalance();
    }

    return () => {
      setPinVerified(false);
    };
  }, [pinVerified, setPinVerified]);
  return (
    <Card className="lg:hidden mb-4 border-none w-[80%] mx-auto">
      <CardContent className="min-h-6 flex items-center justify-center">
        {balance !== undefined ? (
          <div className="text-base-content text-sm flex gap-x-2 font-semibold">
            <div>Available Balance :</div>
            {"₹"}
            {balance}
          </div>
        ) : (
          <div className="flex justify-center h-6 items-center gap-x-2">
            <div className="text-base-content font-medium text-sm">
              View Balance
            </div>
            <div>
              <MdOutlineArrowCircleRight
                className="text-base-content"
                onClick={async () => {
                  const { success, msg } = await checkAccountPinExists();
                  if (!success) {
                    toast.error(msg);
                    setShowCreatePinModal(true);
                    return;
                  }

                  setShowPinModal(true);
                }}
              />
            </div>
            <PinModal open={showPinModal} setOpen={setShowPinModal} />
            <CreatePinModal
              open={showCreatePinModal}
              setOpen={setShowCreatePinModal}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
