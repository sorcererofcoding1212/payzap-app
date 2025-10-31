import { checkEmailVerify } from "@/actions/checkEmailVerify";
import { validateSession } from "@/actions/validateSession";
import { PageTitle } from "@/components/PageTitle";
import { TransferMoneyCard } from "@/features/transfer/components/TransferMoneyCard";

const TransferPage = async () => {
  const session = await validateSession();
  const { emailVerified } = await checkEmailVerify(session.user.id);
  return (
    <div className="px-2 lg:px-6">
      <PageTitle title="Transfer" />
      <div className="pt-8 lg:pt-10">
        <TransferMoneyCard isEmailVerified={emailVerified} />
      </div>
    </div>
  );
};

export default TransferPage;
