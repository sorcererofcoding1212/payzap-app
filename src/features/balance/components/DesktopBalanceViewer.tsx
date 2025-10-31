"use client";

import { checkAccountPinExists } from "@/actions/checkAccountPinExists";
import { fetchUserBalance } from "@/actions/fetchUserBalance";
import { CreatePinModal } from "@/components/CreatePinModal";
import { DottedSeperator } from "@/components/DottedSeperator";
import { PinModal } from "@/components/PinModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAccountStore } from "@/store/accountStore";
import { useEffect, useState } from "react";
import { MdOutlineArrowCircleRight } from "react-icons/md";
import { toast } from "sonner";

export const DesktopBalanceViewer = () => {
  const [showPinModal, setShowPinModal] = useState<boolean>(false);
  const [showCreatePinModal, setShowCreatePinModal] = useState<boolean>(false);
  const pinVerified = useAccountStore((state) => state.pinVerified);
  const setPinVerified = useAccountStore((state) => state.setPinVerified);
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
  }, [pinVerified, balance, setPinVerified]);
  return (
    <div className="w-[40%] hidden lg:flex flex-col justify-between">
      <Card className="w-full h-fit hidden lg:flex">
        <CardHeader>
          <CardTitle className="text-lg text-base-content">Balance</CardTitle>
        </CardHeader>
        <DottedSeperator className="px-6" color="silver" />
        <CardContent>
          <div className="h-6 flex items-center">
            {balance !== undefined ? (
              <div className="text-base-content flex gap-x-2 font-semibold">
                <div>Available Balance :</div>
                {"₹"}
                {balance}
              </div>
            ) : (
              <div className="flex gap-x-2 items-center text-base-content">
                <div className="text-sm font-medium">View Balance</div>
                <MdOutlineArrowCircleRight
                  className="cursor-pointer"
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
            )}
          </div>
          <PinModal open={showPinModal} setOpen={setShowPinModal} />
          <CreatePinModal
            open={showCreatePinModal}
            setOpen={setShowCreatePinModal}
          />
        </CardContent>
      </Card>
    </div>
  );
};
