"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MdOutlineArrowCircleRight } from "react-icons/md";
import { useEmailVerify } from "../../../hooks/useEmailVerify";

interface MobileEmailVerifierCardProps {
  isEmailVerified: boolean | undefined;
  email: string;
  name: string;
}

export const MobileEmailVerifierCard = ({
  isEmailVerified,
  email,
  name,
}: MobileEmailVerifierCardProps) => {
  const { verifyEmail, loading } = useEmailVerify(email, name);
  return (
    <Card
      className={cn(
        "lg:hidden mb-4 border-none w-[80%] mx-auto",
        isEmailVerified && "hidden"
      )}
    >
      <CardContent className="min-h-6 flex items-center justify-center">
        <div className="flex justify-center h-6 items-center gap-x-2">
          <div className="text-base-content font-medium text-sm">
            Verify your email
          </div>
          <MdOutlineArrowCircleRight
            onClick={verifyEmail}
            className={cn(
              "cursor-pointer text-base-content",
              loading && "animate-pulse opacity-70 cursor-not-allowed"
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};
