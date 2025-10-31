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
  const checkEmailExistsAndResendLink = () => {
    if (!email) {
      toast.error("Invalid request");
      return;
    }

    const { verifyEmail } = useEmailVerify(email);
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
