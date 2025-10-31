import { SignupCard } from "@/features/auth/components/SignupCard";
import { AUTH_OPTIONS } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

const SignupPage = async () => {
  const session = await getServerSession(AUTH_OPTIONS);

  if (session) {
    redirect("/");
  }
  return (
    <div className="flex justify-center w-full">
      <SignupCard />
    </div>
  );
};

export default SignupPage;
