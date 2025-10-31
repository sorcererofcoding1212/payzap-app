import { validateSession } from "@/actions/validateSession";
import { PageTitle } from "@/components/PageTitle";
import { DesktopBalanceViewer } from "@/features/balance/components/DesktopBalanceViewer";
import { MobileBalanceViewer } from "@/features/balance/components/MobileBalanceViewer";
import { AddMoneyCard } from "@/features/balance/components/AddMoneyCard";
import { checkEmailVerify } from "@/actions/checkEmailVerify";

const BalancePage = async () => {
  const session = await validateSession();

  const { emailVerified } = await checkEmailVerify(session.user.id);
  return (
    <div className="px-2 lg:px-6">
      <PageTitle title="Balance" />
      <div className="pt-8 lg:pt-10">
        <MobileBalanceViewer />
        <div className="block lg:flex justify-between">
          <AddMoneyCard isEmailVerified={emailVerified} />
          <DesktopBalanceViewer />
        </div>
      </div>
    </div>
  );
};

export default BalancePage;
