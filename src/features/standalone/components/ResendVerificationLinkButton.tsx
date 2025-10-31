"use client";

import { Button } from "@/components/ui/button";
import { useEmailVerify } from "@/hooks/useEmailVerify";
import { toast } from "sonner";

interface ResendVerificationLinkButtonProps {
  email: string | undefined;
}

export const ResendVerificationLinkButton = ({
  email,
}: ResendVerificationLinkButtonProps) => {
  const { verifyEmail } = useEmailVerify(email || "");

  const checkEmailExistsAndResendLink = () => {
    if (!email || email.length < 1) {
      toast.error("Invalid request");
      return;
    }

    verifyEmail();
  };

  return (
    <div className="flex justify-center items-center mt-3 lg:mt-4">
      <Button
        onClick={checkEmailExistsAndResendLink}
        variant={"teritary"}
        size={"variable"}
      >
        Resend Link
      </Button>
    </div>
  );
};
