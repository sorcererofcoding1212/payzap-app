import { checkEmailVerify } from "@/actions/checkEmailVerify";
import { validateSession } from "@/actions/validateSession";
import { PageTitle } from "@/components/PageTitle";
import { RequestMoneyCard } from "@/features/request/components/RequestMoneyCard";

const RequestPage = async () => {
  const session = await validateSession();
  const { emailVerified } = await checkEmailVerify(session.user.id);
  return (
    <div className="px-2 lg:px-6">
      <PageTitle title="Request" />
      <div className="pt-8 lg:pt-10">
        <RequestMoneyCard isEmailVerified={emailVerified} />
      </div>
    </div>
  );
};

export default RequestPage;
