import React from "react";
import { poppins } from "@/fonts/poppins";
import { CheckCircle2, XCircle } from "lucide-react";
import { verifyEmailToken } from "@/features/standalone/actions/verifyEmailToken";
import { ResendVerificationLinkButton } from "@/features/standalone/components/ResendVerificationLinkButton";

interface VerifyEmailPageProps {
  searchParams: Promise<{ token: string }>;
}

const VerifyEmailPage = async ({ searchParams }: VerifyEmailPageProps) => {
  const { token } = await searchParams;
  const result = await verifyEmailToken(token);

  if (!result.success) {
    return (
      <div className="pt-18 lg:pt-16">
        <XCircle
          className="text-red-500 w-16 h-16 mb-6 mx-auto"
          strokeWidth={2.5}
        />
        <div className="flex flex-col items-center">
          <div
            className={`${poppins.className} text-2xl text-center text-red-500 lg:text-3xl px-8 font-semibold`}
          >
            Invalid or expired link
          </div>
          <ResendVerificationLinkButton email={result.email} />
        </div>
      </div>
    );
  }
  return (
    <div className="pt-18 lg:pt-16">
      <CheckCircle2
        className="text-teal-500 w-16 h-16 mb-6 mx-auto"
        strokeWidth={2.5}
      />
      <div className="flex flex-col items-center">
        <div
          className={`${poppins.className} text-2xl text-center text-teal-500 lg:text-3xl px-8 font-semibold`}
        >
          Congratulations, your email is verified
        </div>
        <div
          className={`${poppins.className} mt-2 text-sm lg:text-base font-semibold text-center px-8 text-base-content`}
        >
          You can now send and recieve money from your wallet
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
