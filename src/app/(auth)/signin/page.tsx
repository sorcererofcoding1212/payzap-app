import { SigninCard } from "@/features/auth/components/SigninCard";
import { AUTH_OPTIONS } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const SigninPage = async () => {
  const session = await getServerSession(AUTH_OPTIONS);

  if (session) {
    redirect("/");
  }
  return (
    <div className="flex justify-center w-full">
      <SigninCard />
    </div>
  );
};

export default SigninPage;
