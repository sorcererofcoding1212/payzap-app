"use client";

import { useState } from "react";
import { useAccountStore } from "@/store/accountStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { validateAccountPin } from "@/actions/validateAccountPin";

interface PinModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  onSuccess?: () => void;
}

export const PinModal = ({ open, setOpen, onSuccess }: PinModalProps) => {
  const { setPinVerified } = useAccountStore();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [maxPinRetries, setMaxPinRetries] = useState<number>(3);

  const handleAccountPinVerify = async () => {
    if (maxPinRetries === 0) {
      setPin("");
      setError("You have reached the maximum number of PIN retries");
      return;
    }

    const response = await validateAccountPin(pin);

    if (!response.success) {
      console.log(response.msg);
      setPin("");
      setError(response.msg);
      setMaxPinRetries((prevValue) => prevValue - 1);
      return;
    }

    setPin("");
    setPinVerified(true);
    setOpen(false);

    if (onSuccess) onSuccess();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle>Account PIN</DialogTitle>
          </DialogHeader>

          <Input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Enter your account PIN"
            className="mt-4"
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <div className="flex justify-end items-center gap-3 mt-4 lg:mt-6">
            <Button variant={"destructive"} onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant={"card"} onClick={handleAccountPinVerify}>
              Verify
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
