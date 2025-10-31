"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { createAccountPin } from "@/actions/createAccountPin";
import { toast } from "sonner";

interface CreatePinModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export const CreatePinModal = ({ open, setOpen }: CreatePinModalProps) => {
  const [pin, setPin] = useState<string>("");
  const [confirmPin, setConfirmPin] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleCreateAccountPin = async () => {
    if (pin.trim().length < 6 || pin.trim().length > 6) {
      setError("Pin length must be of 6 characters only");
    }
    
    if (pin !== confirmPin) {
      setError("PIN does not match");
      return;
    }

    const { msg, success } = await createAccountPin(pin);

    if (!success) {
      setError(msg);
      return;
    }

    toast.success(msg);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle>Create your account PIN</DialogTitle>
        </DialogHeader>

        <Input
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="Create your PIN"
          className="mt-4"
        />
        <Input
          type="password"
          value={confirmPin}
          onChange={(e) => setConfirmPin(e.target.value)}
          placeholder="Confirm your PIN"
          className="mt-4"
        />
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <div className="flex justify-end items-center gap-3 mt-4 lg:mt-6">
          <Button variant={"destructive"} onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant={"card"} onClick={handleCreateAccountPin}>
            Create
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
