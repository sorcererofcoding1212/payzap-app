"use client";

import { DottedSeperator } from "@/components/DottedSeperator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MdOutlineArrowCircleRight } from "react-icons/md";
import { cn } from "@/lib/utils";
import { useEmailVerify } from "../../../hooks/useEmailVerify";

interface EmailVerifierCardProps {
  isEmailVerfied: boolean | undefined;
  name: string;
  email: string;
}

export const DesktopEmailVerifierCard = ({
  isEmailVerfied,
  name,
  email,
}: EmailVerifierCardProps) => {
  const { verifyEmail, loading } = useEmailVerify(email, name);
  return (
    <div
      className={cn(
        "text-base-content w-[40%] hidden",
        !isEmailVerfied && "lg:flex"
      )}
    >
      <Card className="w-full h-fit hidden lg:flex">
        <CardHeader>
          <CardTitle className="text-lg text-base-content">
            Verify Email
          </CardTitle>
        </CardHeader>
        <DottedSeperator className="px-6" color="silver" />
        <CardContent>
          <div className="text-base-content h-6 flex gap-x-2 items-center">
            <div className="text-sm font-medium">Verify your email</div>
            <MdOutlineArrowCircleRight
              onClick={() => {
                console.log("Initiated email verify call from the button");
                verifyEmail();
              }}
              className={cn(
                "cursor-pointer text-base-content",
                loading && "animate-pulse opacity-70 cursor-not-allowed"
              )}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
