"use client";

import { useState } from "react";
import { toast } from "sonner";
import { sendVerificationEmail } from "../features/home/actions/sendVerificationEmail";

export const useEmailVerify = (email: string, name?: string) => {
  const [loading, setLoading] = useState<boolean>(false);

  const verifyEmail = async () => {
    try {
      if (loading) return;
      setLoading(true);
      console.log("Verification initiated from email verify hook");
      const { success } = await sendVerificationEmail(email, name);
      if (!success) {
        toast.error("Some error occured");
        return;
      }
      toast.success("Verification email sent to registered email address");
    } catch {
      toast.error("Some error occured");
    } finally {
      setLoading(false);
    }
  };

  return { verifyEmail, loading };
};
