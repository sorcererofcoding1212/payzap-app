import { checkEmailVerify } from "@/actions/checkEmailVerify";
import { validateSession } from "@/actions/validateSession";
import { PageTitle } from "@/components/PageTitle";
import { DesktopEmailVerifierCard } from "@/features/home/components/DesktopEmailVerifierCard";
import { GraphCarousel } from "@/features/home/components/GraphCarousel";
import { MobileEmailVerifierCard } from "@/features/home/components/MobileEmailVerifierCard";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  const session = await validateSession();
  const { email, emailVerified, name } = await checkEmailVerify(
    session.user.id
  );
  if (!email || !name) redirect("/signin");

  return (
    <div className="px-2 lg:px-6">
      <PageTitle title="Dashboard" />
      <div className="pt-8 lg:pt-10">
        <MobileEmailVerifierCard
          isEmailVerified={emailVerified}
          email={email}
          name={name}
        />
        <div className="block lg:flex justify-between">
          <GraphCarousel />
          <DesktopEmailVerifierCard
            isEmailVerfied={emailVerified}
            email={email}
            name={name}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
